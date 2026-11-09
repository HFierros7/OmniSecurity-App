import { escapeHtml } from "./og-html.js";

function topicsMarkup(topics, emptyMessage) {
  if (!topics.length) return `<p class="muted">${emptyMessage}</p>`;
  return `<ul class="topic-results">${topics.map((topic) => `
    <li><span>${escapeHtml(topic.name)}</span><strong>${topic.percentage}% (${topic.correct}/${topic.total})</strong></li>`).join("")}</ul>`;
}

export function renderResults(state, courseKey, attemptId) {
  const course = state.data.courses.find((item) => item.key === courseKey);
  const result = state.examResultsById[attemptId];
  if (!course || !result || result.courseKey !== courseKey) {
    return `<section class="empty-state"><h1>Resultado no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  }

  return `
    <section class="page-heading"><div><span class="eyebrow">Resultados de prueba</span><h1>${escapeHtml(course.title)}</h1></div><span class="status-pill status-pill--demo">No certificable</span></section>
    <p class="inline-notice">Resultado de una evaluación local AVSEC de demostración, versión ${escapeHtml(course.contentVersion || "demo")}. No es una calificación oficial ni constancia de capacitación.</p>
    <section class="panel results-summary" aria-labelledby="result-score">
      <span class="eyebrow">Calificación demo</span><h2 id="result-score">${result.percentage}%</h2>
      <p>${result.correctCount} respuestas correctas de ${result.questionCount}</p>
      <p class="result-status ${result.passed ? "result-status--pass" : "result-status--fail"}">${result.passed ? "Umbral demo alcanzado" : "Umbral demo no alcanzado"}</p>
      <p class="helper-text">Umbral de demostración: ${result.passingScore}% · ${Math.ceil(result.questionCount * result.passingScore / 100)} respuestas correctas. Requiere aprobación académica y evaluación confiable para uso oficial.</p>
    </section>
    <section class="panel"><h2>Temas fuertes</h2>${topicsMarkup(result.strongTopics, "No hay temas por encima del umbral demo.")}</section>
    <section class="panel"><h2>Temas por repasar</h2>${topicsMarkup(result.weakTopics, "Todos los temas alcanzaron el umbral demo.")}</section>
    <a class="button button--primary" href="#/academy" data-route="academy">Volver a Academia</a>`;
}
