import { escapeHtml } from "../app/html.js";
import { closePlayerNavigation, renderPlayerNavigation } from "../components/lms-player.js";

export function renderUnit(data, courseKey, unitCode) {
  const course = data.courses.find((item) => item.key === courseKey);
  const unit = data.units.find((item) => item.codigo === unitCode && item.curso_codigo === course?.code);
  const lesson = data.lessons.find((item) => item.unidad_codigo === unit?.codigo);
  if (!course || !unit) return `<section class="empty-state"><h1>Unidad no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  const content = courseKey === "AVSEC"
    ? data.avsecCourse.units.find((item) => item.unit_id === unitCode)
    : null;
  if (!content) return `<section class="empty-state"><h1>Contenido no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;

  return `
    <section class="page-heading"><div><a class="back-link" href="#/course/${escapeHtml(course.key)}" data-route="course/${escapeHtml(course.key)}">← ${escapeHtml(course.title)}</a><span class="eyebrow">Course Player · unidad</span><h1>${escapeHtml(unit.titulo)}</h1></div></section>
    ${renderPlayerNavigation(course, "unit", unit, lesson)}
    <section class="panel">
      <span class="status-pill status-pill--demo">Unidad ${content.sequence} de 5 · borrador de revisión</span>
      <p>${escapeHtml(content.introduction)}</p>
      <h2>Objetivos de aprendizaje</h2>
      <ul class="lesson-list">${content.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}</ul>
      ${lesson ? `<a class="list-link" href="#/lesson/${escapeHtml(course.key)}/${escapeHtml(lesson.codigo)}" data-route="lesson/${escapeHtml(course.key)}/${escapeHtml(lesson.codigo)}"><span>${escapeHtml(lesson.titulo)}</span><span>Abrir lección →</span></a>` : '<p class="empty-state">No hay lecciones registradas para esta unidad.</p>'}
      <div class="button-row">
        <a class="button button--secondary" href="#/activity/${escapeHtml(course.key)}/${escapeHtml(content.activity_ref)}" data-route="activity/${escapeHtml(course.key)}/${escapeHtml(content.activity_ref)}">Actividad interactiva</a>
        <a class="button button--primary" href="#/quiz/${escapeHtml(course.key)}/${escapeHtml(unit.codigo)}" data-route="quiz/${escapeHtml(course.key)}/${escapeHtml(unit.codigo)}">Cuestionario · 5 preguntas</a>
      </div>
      <p class="helper-text">${content.estimated_minutes / 60} h estimadas · las duraciones son orientativas y requieren validación editorial.</p>
    </section>
    ${closePlayerNavigation()}`;
}
