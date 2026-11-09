import { escapeHtml } from "./og-html.js";
import { getExamQuestions, matchesQuestionSet } from "./og-lms-assessment.js";
import { closePlayerNavigation, renderPlayerNavigation } from "./og-lms-player.js";

export function renderExam(data, state, courseKey) {
  const course = data.courses.find((item) => item.key === courseKey);
  if (!course) return `<section class="empty-state"><h1>Evaluación no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  const unit = data.units.find((item) => item.codigo === course.unitCode);
  const lesson = data.lessons.find((item) => item.codigo === course.lessonCode);
  const attempt = state.examAttemptsByCourse[courseKey];
  const questions = getExamQuestions(data, courseKey, attempt?.questionIds);
  if (!questions.length) return `<section class="empty-state"><h1>Evaluación no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  const count = questions.length;

  if (attempt && !matchesQuestionSet(attempt, questions, data.avsecCourse.content_version)) {
    return `<section class="panel"><h1>Evaluación actualizada</h1><p>El intento guardado pertenece al examen técnico anterior. Inicia un nuevo intento para responder la evaluación AVSEC actual.</p><button class="button button--primary" type="button" data-action="exam-retry" data-course="${escapeHtml(courseKey)}">Iniciar nuevo intento</button></section>`;
  }

  if (!attempt) {
    return `
      <section class="page-heading"><div><a class="back-link" href="#/course/${escapeHtml(course.key)}" data-route="course/${escapeHtml(course.key)}">← ${escapeHtml(course.title)}</a><span class="eyebrow">Evaluación final · demo</span><h1>Evaluación final AVSEC</h1></div><span class="status-pill status-pill--demo">${count} preguntas</span></section>
      ${renderPlayerNavigation(course, "exam", unit, lesson)}
      <section class="panel"><p class="inline-notice">${escapeHtml(data.avsecCourse.editorial_notice)} Las respuestas se mantienen ocultas en la interfaz hasta finalizar; al ser una app estática, la clave puede inspeccionarse técnicamente.</p>
        <dl class="course-meta">
          <div><dt>Preguntas</dt><dd>${count}</dd></div>
          <div><dt>Umbral demo</dt><dd>${data.avsecExam.porcentaje_aprobacion}% · ${Math.ceil(count * data.avsecExam.porcentaje_aprobacion / 100)} aciertos</dd></div>
          <div><dt>Banco</dt><dd>${escapeHtml(data.avsecExam.banco_codigo)} · selección equilibrada por unidad</dd></div>
        </dl>
        <button class="button button--primary" type="button" data-action="start-exam" data-course="${escapeHtml(courseKey)}">Iniciar evaluación demo</button>
      </section>
      ${closePlayerNavigation()}`;
  }

  if (attempt.submitted) {
    return `<section class="page-heading"><div><span class="eyebrow">Examen Player</span><h1>Intento finalizado</h1></div></section>
      ${renderPlayerNavigation(course, "exam", unit, lesson)}
      <section class="panel"><p>Este intento no puede reabrirse.</p><div class="button-row"><a class="button button--primary" href="#/results/${escapeHtml(courseKey)}/${escapeHtml(attempt.attemptId)}" data-route="results/${escapeHtml(courseKey)}/${escapeHtml(attempt.attemptId)}">Ver resultados demo</a><button class="button button--secondary" type="button" data-action="exam-retry" data-course="${escapeHtml(courseKey)}">Iniciar nuevo intento demo</button></div></section>
      ${closePlayerNavigation()}`;
  }

  const index = Math.min(Math.max(0, attempt.currentIndex || 0), count - 1);
  const question = questions[index];
  const selected = attempt.answers[question.id];
  const marked = attempt.markedForReview.includes(question.id);
  const unanswered = count - Object.keys(attempt.answers).length;

  return `
    <section class="page-heading"><div><a class="back-link" href="#/course/${escapeHtml(course.key)}" data-route="course/${escapeHtml(course.key)}">← ${escapeHtml(course.title)}</a><span class="eyebrow">Evaluación · guardado local</span><h1>Pregunta ${index + 1} de ${count}</h1></div><span class="status-pill status-pill--demo">Demo no certificable</span></section>
    ${renderPlayerNavigation(course, "exam", unit, lesson)}
    <p class="inline-notice">Prueba local de aprendizaje. La interfaz no muestra corrección antes del envío; no es una evaluación oficial.</p>
    <section class="panel exam-panel">
      <div class="exam-toolbar"><span>Avance: ${count - unanswered}/${count}</span><span role="status">${escapeHtml(attempt.saveStatus || "Estado restaurado localmente")}</span></div>
      <nav class="exam-question-nav" aria-label="Navegación de preguntas">
        ${questions.map((item, itemIndex) => {
          const answered = Object.hasOwn(attempt.answers, item.id);
          const isCurrent = itemIndex === index;
          const isMarked = attempt.markedForReview.includes(item.id);
          const labels = [isCurrent && "actual", answered && "respondida", isMarked && "revisar después"].filter(Boolean).join(", ");
          return `<button type="button" class="exam-question-chip${isCurrent ? " is-current" : ""}${answered ? " is-answered" : ""}${isMarked ? " is-marked" : ""}" data-action="exam-go-question" data-index="${itemIndex}" aria-label="Pregunta ${itemIndex + 1}${labels ? `, ${labels}` : ", no respondida"}" aria-current="${isCurrent ? "step" : "false"}">${itemIndex + 1}</button>`;
        }).join("")}
      </nav>
      <progress class="exam-progress" max="${count}" value="${count - unanswered}" aria-label="Preguntas respondidas">${count - unanswered}</progress>
      <h2>${escapeHtml(question.prompt)}</h2>
      <fieldset class="exam-options"><legend>Elige una respuesta</legend>
        ${question.options.map((option) => `
          <label class="exam-option"><input type="radio" name="exam-answer" value="${escapeHtml(option.id)}" data-question-id="${escapeHtml(question.id)}" ${selected === option.id ? "checked" : ""}><span>${escapeHtml(option.text)}</span></label>`).join("")}
      </fieldset>
      <div class="exam-controls">
        <button class="button button--secondary" type="button" data-action="exam-previous" ${index === 0 ? "disabled" : ""}>Anterior</button>
        <button class="button button--secondary" type="button" data-action="exam-toggle-review" aria-pressed="${marked}">${marked ? "Quitar marca de revisión" : "Marcar para revisar después"}</button>
        <button class="button button--secondary" type="button" data-action="exam-next" ${index === count - 1 ? "disabled" : ""}>Siguiente</button>
      </div>
      <div class="button-row"><button class="button button--primary" type="button" data-action="exam-submit-request">Finalizar examen</button></div>
      <p class="helper-text">${unanswered} sin responder · ${attempt.markedForReview.length} marcada(s) para revisar.</p>
    </section>
    ${closePlayerNavigation()}`;
}
