import { escapeHtml, progressMarkup } from "./og-html.js";
import { closePlayerNavigation, renderPlayerNavigation } from "./og-lms-player.js";

export function renderCourse(data, state, courseKey) {
  const course = data.courses.find((item) => item.key === courseKey);
  if (!course) return `<section class="empty-state"><h1>Curso no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  if (course.key !== "AVSEC" || !data.avsecCourse) {
    return `
      <section class="page-heading"><div><a class="back-link" href="#/academy" data-route="academy">← Academia</a><span class="eyebrow">Catálogo de cursos</span><h1>${escapeHtml(course.title)}</h1></div></section>
      <section class="panel course-detail"><img class="course-hero-image" src="${escapeHtml(course.image)}" alt="Ilustración del curso ${escapeHtml(course.title)}"><span class="status-pill">${escapeHtml(course.status)}</span><p>${escapeHtml(course.description)}</p><p class="inline-notice">El contenido y las evaluaciones de este curso aún no están disponibles.</p></section>`;
  }
  const units = course.units;
  const unit = units.find((item) => item.lessons.length) || units[0];
  const lesson = unit?.lessons[0];
  const hasUnit = Boolean(unit);
  const progress = state.progressByCourse[course.key]?.percentComplete ?? course.progress;

  return `
    <section class="page-heading"><div><a class="back-link" href="#/academy" data-route="academy">← Academia</a><span class="eyebrow">Course Player · versión ${escapeHtml(course.contentVersion)}</span><h1>${escapeHtml(course.title)}</h1></div><span class="status-pill status-pill--demo">Demo · revisión requerida</span></section>
    ${renderPlayerNavigation(course, "course", unit, lesson)}
    <section class="panel course-detail">
      <img class="course-hero-image" src="${escapeHtml(course.image)}" alt="Ilustración demostrativa: ${escapeHtml(course.title)}">
      <span class="course-tag">${escapeHtml(course.tag)}</span><p>${escapeHtml(course.description)}</p>
      <p class="helper-text">Identificador: ${escapeHtml(course.code)} · versión de contenido ${escapeHtml(course.contentVersion)}</p>
      <div class="course-facts">
        <span>${course.durationMinutes ? `${Math.round(course.durationMinutes / 60)} h estimadas` : "Duración por definir"}</span>
        <span>${course.unitCount} ${course.unitCount === 1 ? "unidad" : "unidades"}</span>
        <span>Evaluación final demo · ${course.evaluationQuestionCount} preguntas · aprobación ${data.avsecExam?.porcentaje_aprobacion ?? 80}%</span>
      </div>
      ${progressMarkup(progress, "Progreso local")}
      ${hasUnit ? `<a class="button button--primary" href="#/unit/${escapeHtml(course.key)}/${escapeHtml(unit.codigo)}" data-route="unit/${escapeHtml(course.key)}/${escapeHtml(unit.codigo)}">Abrir primera unidad</a>` : '<p class="empty-state">No hay unidades publicadas para este curso.</p>'}
      <a class="button button--secondary" href="#/exam/${escapeHtml(course.key)}" data-route="exam/${escapeHtml(course.key)}">Abrir evaluación final · demo</a>
    </section>
    <section class="panel"><div class="panel-heading"><div><span class="eyebrow">Course Player</span><h2>Unidades y lecciones</h2></div></div>
      ${units.length ? units.map((courseUnit) => `
        <a class="list-link" href="#/unit/${escapeHtml(course.key)}/${escapeHtml(courseUnit.codigo)}" data-route="unit/${escapeHtml(course.key)}/${escapeHtml(courseUnit.codigo)}"><span>${escapeHtml(courseUnit.titulo)} · ${courseUnit.lessons.length} lección(es)</span><span>Abrir →</span></a>
        ${courseUnit.lessons.map((courseLesson) => `<a class="list-link player-lesson-link" href="#/lesson/${escapeHtml(course.key)}/${escapeHtml(courseLesson.codigo)}" data-route="lesson/${escapeHtml(course.key)}/${escapeHtml(courseLesson.codigo)}"><span>${escapeHtml(courseLesson.titulo)}</span><span>Lección →</span></a>`).join("")}`).join("") : '<p class="muted">No hay unidades publicadas para este curso.</p>'}
    </section>
    <p class="inline-notice">${escapeHtml(data.avsecCourse.editorial_notice)}</p>
    ${closePlayerNavigation()}`;
}
