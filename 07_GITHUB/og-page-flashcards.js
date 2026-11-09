import { escapeHtml } from "./og-html.js";

export function renderFlashcards(data, state, courseKey, deckId) {
  const course = data.courses.find((item) => item.key === courseKey);
  if (!course || courseKey !== "MERCANCIAS_PELIGROSAS" || deckId !== "DEMO-MP") {
    return `<section class="empty-state"><h1>Tarjetas no disponibles</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  }
  return `
    <section class="page-heading"><div><a class="back-link" href="#/academy" data-route="academy">← Academia</a><span class="eyebrow">Catálogo de cursos</span><h1>${escapeHtml(course.title)}</h1></div></section>
    <section class="panel"><span class="status-pill">Disponible próximamente</span><p>El contenido de este curso aún no está disponible.</p></section>`;
}
