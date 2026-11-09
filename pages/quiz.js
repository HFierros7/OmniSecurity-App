import { escapeHtml } from "../app/html.js";
import { getQuizQuestions, matchesQuestionSet } from "../app/lms/assessment.js";
import { closePlayerNavigation, renderPlayerNavigation } from "../components/lms-player.js";

export function renderQuiz(data, state, courseKey, unitCode) {
  const course = data.courses.find((item) => item.key === courseKey);
  const unit = data.units.find((item) => item.codigo === unitCode && item.curso_codigo === course?.code);
  if (!course || !unit) {
    return `<section class="empty-state"><h1>Cuestionario no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  }

  const questions = getQuizQuestions(data, courseKey, unitCode);
  if (!questions.length) return `<section class="empty-state"><h1>Cuestionario próximamente</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  const quizId = `${courseKey}:${unitCode}`;
  const savedAttempt = state.quizzesById[quizId];
  if (savedAttempt && !matchesQuestionSet(savedAttempt, questions, data.avsecCourse.content_version)) {
    return `<section class="panel"><h1>Práctica actualizada</h1><p>El intento guardado pertenece a la versión demo anterior. Inicia un intento nuevo para usar las preguntas AVSEC actuales.</p><button class="button button--primary" type="button" data-action="quiz-retry" data-course="${escapeHtml(courseKey)}" data-unit="${escapeHtml(unitCode)}">Iniciar nuevo intento</button></section>`;
  }
  const attempt = savedAttempt || {
    currentIndex: 0,
    questionIds: questions.map((question) => question.id),
    contentVersion: data.avsecCourse.content_version,
    answers: {},
    submitted: false
  };
  const index = Math.min(Math.max(0, attempt.currentIndex || 0), questions.length - 1);
  const question = questions[index];
  const selected = attempt.answers[question.id];
  const correct = selected === question.correctOptionId;
  const result = attempt.result;

  return `
    <section class="page-heading"><div><span class="eyebrow">Cuestionario de unidad · práctica</span><h1>${escapeHtml(unit.titulo)}</h1></div><span class="status-pill status-pill--demo">${questions.length} preguntas · demo</span></section>
    ${renderPlayerNavigation(course, "quiz", unit, null)}
    <p class="inline-notice">Práctica local con contenido AVSEC de demostración en revisión. La puntuación no acredita capacitación.</p>
    ${result ? `<section class="panel quiz-result" role="status">
      <span class="eyebrow">Práctica finalizada</span><h2>${result.percentage}% · ${result.correctCount} de ${result.questionCount}</h2>
      <p>Resultado de práctica local; no representa aprobación oficial.</p>
      <button class="button button--secondary" type="button" data-action="quiz-retry" data-course="${escapeHtml(courseKey)}" data-unit="${escapeHtml(unitCode)}">Iniciar nuevo intento demo</button>
    </section>` : `
      <section class="panel quiz-panel">
        <div class="quiz-progress"><span>Pregunta ${index + 1} de ${questions.length}</span><span>${Object.keys(attempt.answers).length} respondidas</span></div>
        <h2>${escapeHtml(question.prompt)}</h2>
        <fieldset class="exam-options"><legend>Selecciona una opción</legend>
          ${question.options.map((option) => `
            <label class="exam-option"><input type="radio" name="quiz-answer" value="${escapeHtml(option.id)}" data-question-id="${escapeHtml(question.id)}" ${selected === option.id ? "checked" : ""}><span>${escapeHtml(option.text)}</span></label>`).join("")}
        </fieldset>
        ${selected ? `<div class="inline-notice" role="status"><strong>${correct ? "Respuesta correcta." : "Respuesta incorrecta."}</strong><p>${escapeHtml(question.explanation)}</p><p>Repaso recomendado: ${escapeHtml(question.reviewRecommendation)}</p></div>` : ""}
        <div class="button-row">
          <button class="button button--secondary" type="button" data-action="quiz-previous" ${index === 0 ? "disabled" : ""}>Anterior</button>
          <button class="button button--secondary" type="button" data-action="quiz-next" ${index === questions.length - 1 ? "disabled" : ""}>Siguiente</button>
          <button class="button button--primary" type="button" data-action="quiz-submit" data-course="${escapeHtml(courseKey)}" data-unit="${escapeHtml(unitCode)}" ${Object.keys(attempt.answers).length !== questions.length ? "disabled" : ""}>Finalizar cuestionario</button>
        </div>
      </section>`}
    ${closePlayerNavigation()}`;
}
