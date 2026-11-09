import { navigate } from "../router.js";
import { createLocalId } from "../persistence/ids.js";
import { saveLearningRecord, saveLearningRecords } from "../persistence/learning.js";
import { saveCourseProgress } from "../persistence/progress.js";
import { closeBottomSheet, openBottomSheet } from "../../components/bottom-sheet.js";
import { showToast } from "../../components/toast.js";
import { getExamQuestions, getQuizQuestions, gradeDemoQuestions, matchesQuestionSet } from "./assessment.js";

function currentRouteParts() {
  return window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

function quizRecordId(courseKey, unitCode) {
  return `${courseKey}:${unitCode}`;
}

function newExamAttempt(courseKey, questions, contentVersion) {
  return {
    id: courseKey,
    courseKey,
    contentVersion,
    attemptId: createLocalId(),
    questionCount: questions.length,
    questionIds: questions.map((question) => question.id),
    currentIndex: 0,
    answers: {},
    markedForReview: [],
    submitted: false,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    saveStatus: "Guardado localmente"
  };
}

function completedAvsecMilestones(state) {
  const units = state.data.avsecCourse.units;
  const contentVersion = state.data.avsecCourse.content_version;
  const lessons = units.filter((unit) => state.activitiesById[`AVSEC:LESSON:${unit.lesson.lesson_id}`]?.contentVersion === contentVersion).length;
  const activities = units.filter((unit) => state.activitiesById[`AVSEC:${unit.activity.activity_id}`]?.contentVersion === contentVersion).length;
  const quizzes = units.filter((unit) => {
    const quiz = state.quizzesById[`AVSEC:${unit.unit_id}`];
    return quiz?.contentVersion === contentVersion && quiz.submitted
      && quiz.questionIds?.join("|") === unit.quiz_refs.join("|");
  }).length;
  return { units, completed: lessons + activities + quizzes };
}

async function updateAvsecProgress(state, unitCode, lessonCode, label) {
  const { units, completed } = completedAvsecMilestones(state);
  const examCompleted = Object.values(state.examResultsById).some((result) => result.courseKey === "AVSEC"
    && result.contentVersion === state.data.avsecCourse.content_version);
  const unit = units.find((item) => item.unit_id === unitCode) || units[0];
  const progress = await saveCourseProgress({
    courseKey: "AVSEC",
    courseCode: "CRS-AVSEC-001",
    contentVersion: state.data.avsecCourse.content_version,
    unitCode: unit?.unit_id || null,
    lessonCode: lessonCode || unit?.lesson.lesson_id || null,
    percentComplete: Math.round((completed + Number(examCompleted)) / (units.length * 3 + 1) * 100),
    lastActivity: new Date().toISOString(),
    lastActivityLabel: label,
    userRef: state.data.user.employeeId
  });
  state.progressByCourse.AVSEC = progress;
  state.resumeCourseKey = "AVSEC";
  state.data.courses = state.data.courses.map((course) => course.key === "AVSEC"
    ? { ...course, progress: progress.percentComplete }
    : course);
}

async function saveExamChange(state, attempt, render) {
  const updated = {
    ...attempt,
    updatedAt: new Date().toISOString(),
    saveStatus: "Guardado localmente"
  };
  try {
    await saveLearningRecord("examAttempts", updated);
    state.examAttemptsByCourse[updated.courseKey] = { ...updated, saveStatus: "Guardado localmente" };
    render();
    return true;
  } catch (error) {
    showToast(`No se guardó el examen en IndexedDB: ${errorText(error)}`, "warning");
    return false;
  }
}

async function saveQuizChange(state, quizId, attempt, render) {
  const updated = {
    ...attempt,
    id: quizId,
    ...(quizId.startsWith("AVSEC:") ? { contentVersion: state.data.avsecCourse.content_version } : {}),
    updatedAt: new Date().toISOString()
  };
  try {
    await saveLearningRecord("quizzes", updated);
    state.quizzesById[quizId] = updated;
    render();
    return true;
  } catch (error) {
    showToast(`No se guardó el cuestionario en IndexedDB: ${errorText(error)}`, "warning");
    return false;
  }
}

function showExamConfirmation(attempt) {
  const unanswered = attempt.questionCount - Object.keys(attempt.answers).length;
  openBottomSheet(`
    <div class="sheet-heading"><div><span class="eyebrow">Confirmar envío</span><h2>Finalizar examen demo</h2></div><button class="icon-button" type="button" data-action="close-sheet" aria-label="Cerrar">×</button></div>
    <p>Al finalizar se calculará el resultado local y se mostrará el análisis por temas.</p>
    <p class="inline-notice">${unanswered} pregunta(s) sin responder · ${attempt.markedForReview.length} marcada(s) para revisar.</p>
    <div class="button-row"><button class="button button--secondary" type="button" data-action="close-sheet">Seguir revisando</button><button class="button button--primary" type="button" data-action="exam-finalize">Finalizar y ver resultados</button></div>`);
}

export async function handleLmsAction(action, target, state, render) {
  try {
    if (action === "complete-lesson" && target.dataset.course === "AVSEC") {
      const lessonCode = target.dataset.lesson;
      const unit = state.data.avsecCourse.units.find((item) => item.lesson.lesson_id === lessonCode);
      if (!unit) return true;
      const record = {
        id: `AVSEC:LESSON:${lessonCode}`,
        courseKey: "AVSEC",
        lessonCode,
        contentVersion: state.data.avsecCourse.content_version,
        completedAt: new Date().toISOString()
      };
      await saveLearningRecord("activities", record);
      state.activitiesById[record.id] = record;
      state.lastLearningActivity = record.completedAt;
      try {
        await updateAvsecProgress(state, unit.unit_id, lessonCode, "Lección AVSEC completada");
      } catch (error) {
        render();
        showToast(`La lección se guardó, pero el progreso no se actualizó: ${errorText(error)}`, "warning");
        return true;
      }
      render();
      showToast("Lección y progreso guardados localmente; no es una constancia oficial.", "success");
      return true;
    }

    if (action.startsWith("flashcard-")) {
      const courseKey = currentRouteParts()[1];
      const course = state.data.courses.find((item) => item.key === courseKey);
      if (!course || courseKey !== "MERCANCIAS_PELIGROSAS") return true;
      const cards = state.data.lmsDemo.flashcards;
      const current = state.flashcardsByCourse[courseKey] || {
        id: courseKey,
        courseKey,
        currentIndex: 0,
        flipped: false,
        learned: []
      };
      const index = Math.min(Math.max(0, current.currentIndex || 0), cards.length - 1);
      const cardId = cards[index].id;
      let updated = { ...current, updatedAt: new Date().toISOString() };

      if (action === "flashcard-flip") updated.flipped = !current.flipped;
      else if (action === "flashcard-next") {
        updated.currentIndex = Math.min(cards.length - 1, index + 1);
        updated.flipped = false;
      } else if (action === "flashcard-previous") {
        updated.currentIndex = Math.max(0, index - 1);
        updated.flipped = false;
      } else if (action === "flashcard-learned") {
        const learned = new Set(current.learned || []);
        if (learned.has(cardId)) learned.delete(cardId);
        else learned.add(cardId);
        updated.learned = [...learned];
      } else return false;

      updated = { id: courseKey, ...updated, courseKey };
      await saveLearningRecord("flashcards", updated);
      state.flashcardsByCourse[courseKey] = updated;
      render();
      return true;
    }

    if (action === "save-activity") {
      const courseKey = target.dataset.course;
      const activityCode = target.dataset.activity;
      const id = `${courseKey}:${activityCode}`;
      const response = document.querySelector('input[name="activity-answer"]:checked')?.value
        || document.querySelector("[data-activity-response]")?.value.trim()
        || "";
      const unit = courseKey === "AVSEC"
        ? state.data.avsecCourse.units.find((item) => item.activity.activity_id === activityCode)
        : null;
      if (courseKey === "AVSEC" && !response) {
        showToast("Selecciona una respuesta antes de guardar la actividad.", "info");
        return true;
      }
      if (courseKey === "AVSEC" && !unit) return true;
      const updated = {
        id,
        courseKey,
        activityCode,
        response,
        ...(unit ? { contentVersion: state.data.avsecCourse.content_version } : {}),
        completedAt: new Date().toISOString(),
        status: "DEMO_GUARDADO_LOCAL",
        correct: unit ? response === unit.activity.correct_option_id : null
      };
      await saveLearningRecord("activities", updated);
      state.activitiesById[id] = updated;
      state.lastLearningActivity = updated.completedAt;
      if (unit) {
        try {
          await updateAvsecProgress(state, unit.unit_id, unit.lesson.lesson_id, "Actividad AVSEC guardada");
        } catch (error) {
          render();
          showToast(`La actividad se guardó, pero el progreso no se actualizó: ${errorText(error)}`, "warning");
          return true;
        }
      }
      render();
      showToast("Actividad guardada localmente; no es una constancia oficial.", "success");
      return true;
    }

    if (action === "quiz-previous" || action === "quiz-next") {
      const [, courseKey, unitCode] = currentRouteParts();
      const id = quizRecordId(courseKey, unitCode);
      const questions = getQuizQuestions(state.data, courseKey, unitCode);
      const saved = state.quizzesById[id];
      const current = matchesQuestionSet(saved, questions, state.data.avsecCourse.content_version)
        ? saved
        : { currentIndex: 0, questionIds: questions.map((question) => question.id), answers: {}, submitted: false };
      if (current.submitted) return true;
      const max = questions.length - 1;
      if (max < 0) return true;
      const delta = action === "quiz-next" ? 1 : -1;
      return saveQuizChange(state, id, { ...current, currentIndex: Math.min(max, Math.max(0, current.currentIndex + delta)) }, render);
    }

    if (action === "quiz-submit") {
      const courseKey = target.dataset.course;
      const unitCode = target.dataset.unit;
      const id = quizRecordId(courseKey, unitCode);
      const current = state.quizzesById[id];
      const questions = getQuizQuestions(state.data, courseKey, unitCode);
      if (!questions.length) return true;
      if (!matchesQuestionSet(current, questions, state.data.avsecCourse.content_version)
          || Object.keys(current.answers).length !== questions.length) {
        showToast("Responde todas las preguntas antes de finalizar.", "info");
        return true;
      }
      const result = gradeDemoQuestions(questions, current.answers, state.data.lmsDemo.demo_passing_score);
      const saved = await saveQuizChange(state, id, {
        ...current,
        submitted: true,
        submittedAt: new Date().toISOString(),
        result
      }, render);
      if (saved && courseKey === "AVSEC") {
        try {
          await updateAvsecProgress(state, unitCode, null, "Cuestionario AVSEC completado");
          render();
        } catch (error) {
          showToast(`El cuestionario se guardó, pero el progreso no se actualizó: ${errorText(error)}`, "warning");
        }
      }
      return saved;
    }

    if (action === "quiz-retry") {
      const courseKey = target.dataset.course;
      const unitCode = target.dataset.unit;
      const id = quizRecordId(courseKey, unitCode);
      const questions = getQuizQuestions(state.data, courseKey, unitCode);
      return saveQuizChange(state, id, {
        id,
        currentIndex: 0,
        questionIds: questions.map((question) => question.id),
        answers: {},
        submitted: false
      }, render);
    }

    if (action === "start-exam" || action === "exam-retry") {
      const courseKey = target.dataset.course || currentRouteParts()[1];
      const course = state.data.courses.find((item) => item.key === courseKey);
      const questions = getExamQuestions(state.data, courseKey);
      if (!course || !questions.length) return true;
      const attempt = newExamAttempt(courseKey, questions, state.data.avsecCourse.content_version);
      await saveLearningRecord("examAttempts", attempt);
      state.examAttemptsByCourse[courseKey] = attempt;
      render();
      showToast("Intento técnico iniciado y guardado localmente.", "info");
      return true;
    }

    if (action === "exam-previous" || action === "exam-next" || action === "exam-go-question" || action === "exam-toggle-review") {
      const [, courseKey] = currentRouteParts();
      const current = state.examAttemptsByCourse[courseKey];
      if (!current || current.submitted) return true;
      const examQuestions = getExamQuestions(state.data, courseKey, current.questionIds);
      if (!matchesQuestionSet(current, examQuestions, state.data.avsecCourse.content_version)) return true;
      const max = current.questionCount - 1;
      let updated = current;
      if (action === "exam-previous") updated = { ...current, currentIndex: Math.max(0, current.currentIndex - 1) };
      if (action === "exam-next") updated = { ...current, currentIndex: Math.min(max, current.currentIndex + 1) };
      if (action === "exam-go-question") {
        const index = Number(target.dataset.index);
        if (!Number.isInteger(index) || index < 0 || index > max) return true;
        updated = { ...current, currentIndex: index };
      }
      if (action === "exam-toggle-review") {
        const questions = getExamQuestions(state.data, courseKey, current.questionIds);
        const questionId = questions[current.currentIndex]?.id;
        const marked = new Set(current.markedForReview);
        if (marked.has(questionId)) marked.delete(questionId);
        else marked.add(questionId);
        updated = { ...current, markedForReview: [...marked] };
      }
      return saveExamChange(state, updated, render);
    }

    if (action === "exam-submit-request") {
      const [, courseKey] = currentRouteParts();
      const attempt = state.examAttemptsByCourse[courseKey];
      if (attempt && !attempt.submitted) showExamConfirmation(attempt);
      return true;
    }

    if (action === "exam-finalize") {
      const [, courseKey] = currentRouteParts();
      const attempt = state.examAttemptsByCourse[courseKey];
      if (!attempt || attempt.submitted) return true;
      const questions = getExamQuestions(state.data, courseKey, attempt.questionIds);
      if (!matchesQuestionSet(attempt, questions, state.data.avsecCourse.content_version)) return true;
      const grade = gradeDemoQuestions(questions, attempt.answers, state.data.avsecExam.porcentaje_aprobacion);
      const submittedAt = new Date().toISOString();
      const finishedAttempt = { ...attempt, submitted: true, submittedAt, result: grade, updatedAt: submittedAt };
      const result = {
        id: attempt.attemptId,
        attemptId: attempt.attemptId,
        courseKey,
        examCode: state.data.avsecExam.codigo,
        contentVersion: state.data.avsecCourse.content_version,
        questionIds: attempt.questionIds,
        ...grade,
        submittedAt,
        status: "DEMO_NO_CERTIFICABLE"
      };
      await saveLearningRecords([
        { store: "examAttempts", record: finishedAttempt },
        { store: "examResults", record: result }
      ]);
      state.examAttemptsByCourse[courseKey] = finishedAttempt;
      state.examResultsById[result.id] = result;
      state.lastLearningActivity = submittedAt;
      let progressError = "";
      try {
        await updateAvsecProgress(state, null, null, "Evaluación AVSEC finalizada");
      } catch (error) {
        progressError = errorText(error);
      }
      closeBottomSheet();
      navigate(`results/${courseKey}/${result.id}`);
      showToast(progressError
        ? `Resultados guardados localmente, pero no se actualizó el progreso: ${progressError}`
        : "Resultados de prueba calculados y guardados localmente.", progressError ? "warning" : "info");
      return true;
    }

    return false;
  } catch (error) {
    showToast(`No se completó la acción LMS: ${errorText(error)}`, "warning");
    return true;
  }
}

export async function handleLmsChange(event, state, render) {
  const target = event.target;
  if (target.matches('input[name="quiz-answer"]')) {
    const [, courseKey, unitCode] = currentRouteParts();
    const id = quizRecordId(courseKey, unitCode);
    const saved = state.quizzesById[id];
    if (saved?.submitted) return true;
    const questions = getQuizQuestions(state.data, courseKey, unitCode);
    const current = matchesQuestionSet(saved, questions, state.data.avsecCourse.content_version)
      ? saved
      : { id, currentIndex: 0, questionIds: questions.map((question) => question.id), answers: {}, submitted: false };
    const question = questions[current.currentIndex];
    if (!question || !question.options.some((option) => option.id === target.value)) return true;
    return saveQuizChange(state, id, {
      ...current,
      answers: { ...current.answers, [question.id]: target.value }
    }, render);
  }

  if (target.matches('input[name="exam-answer"]')) {
    const [, courseKey] = currentRouteParts();
    const current = state.examAttemptsByCourse[courseKey];
    if (!current || current.submitted || current.contentVersion !== state.data.avsecCourse.content_version) return true;
    const questions = getExamQuestions(state.data, courseKey, current.questionIds);
    const question = questions[current.currentIndex];
    if (!question || !question.options.some((option) => option.id === target.value)) return true;
    return saveExamChange(state, {
      ...current,
      answers: { ...current.answers, [question.id]: target.value }
    }, render);
  }

  return false;
}
