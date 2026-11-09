import { escapeHtml, progressMarkup } from "./og-html.js";
import { renderLessonContent } from "./og-lms-content.js";
import { closePlayerNavigation, renderPlayerNavigation } from "./og-lms-player.js";

export function renderLesson(data, state, courseKey, lessonCode) {
  const course = data.courses.find((item) => item.key === courseKey);
  const lesson = data.lessons.find((item) => item.codigo === lessonCode);
  const unit = data.units.find((item) => item.codigo === lesson?.unidad_codigo);
  if (!course || !lesson || !unit || unit.curso_codigo !== course.code) return `<section class="empty-state"><h1>Lección no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  const progress = state.progressByCourse[courseKey]?.percentComplete ?? course.progress;
  const unitContent = data.avsecCourse.units.find((item) => item.unit_id === unit.codigo);
  const content = unitContent?.lesson;
  if (!content || courseKey !== "AVSEC") return `<section class="empty-state"><h1>Contenido no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  const completed = Boolean(state.activitiesById[`${courseKey}:LESSON:${lessonCode}`]?.completedAt);
  const activity = unitContent.activity;
  const references = unitContent.reference_refs
    .map((referenceId) => data.avsecCourse.references.find((reference) => reference.reference_id === referenceId))
    .filter(Boolean);

  return `
    <section class="page-heading"><div><span class="eyebrow">Course Player · lección ${escapeHtml(lesson.codigo)}</span><h1>${escapeHtml(lesson.titulo)}</h1></div></section>
    ${renderPlayerNavigation(course, "lesson", unit, lesson)}
    <article class="panel lesson-content">
      <span class="status-pill status-pill--demo">Material demo · revisión AVSEC requerida</span>
      <p>${escapeHtml(unitContent.introduction)}</p>
      <h2>Objetivos</h2><ul class="lesson-list">${unitContent.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}</ul>
      <h2>Conceptos clave</h2><ul class="lesson-list">${content.concepts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <h2>Material de aprendizaje</h2>${renderLessonContent(content.content_blocks)}
      <details class="lesson-block lesson-accordion"><summary>Ejemplos</summary><ul class="lesson-list">${content.examples.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details>
      <details class="lesson-block lesson-accordion"><summary>Errores frecuentes</summary><ul class="lesson-list">${content.common_errors.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details>
      <details class="lesson-block lesson-accordion"><summary>Factores humanos</summary><ul class="lesson-list">${content.human_factors.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details>
      <section class="lesson-block case-card"><span class="eyebrow">Caso práctico</span><h3>${escapeHtml(content.case.title)}</h3><p>${escapeHtml(content.case.description)}</p></section>
      <section class="lesson-block"><h2>Resumen</h2><p>${escapeHtml(content.summary)}</p></section>
      <section class="lesson-references"><h3>Referencias de consulta</h3><ul>${references.map((reference) => `<li class="lesson-reference">${escapeHtml(reference.organization)}. ${escapeHtml(reference.title)}. <a href="${escapeHtml(reference.url)}" target="_blank" rel="noreferrer">Fuente oficial</a> · ${escapeHtml(reference.verification_status)}</li>`).join("")}</ul></section>
      ${progressMarkup(progress, "Progreso local del curso")}
      <div class="button-row">
        <button class="button button--primary" type="button" data-action="complete-lesson" data-course="${escapeHtml(course.key)}" data-lesson="${escapeHtml(lessonCode)}" ${completed ? "disabled" : ""}>${completed ? "Lección completada · guardada localmente" : "Marcar lección completada"}</button>
        <a class="button button--secondary" href="#/activity/${escapeHtml(course.key)}/${escapeHtml(activity.activity_id)}" data-route="activity/${escapeHtml(course.key)}/${escapeHtml(activity.activity_id)}">Actividad: ${escapeHtml(activity.title)}</a>
        <a class="button button--secondary" href="#/quiz/${escapeHtml(course.key)}/${escapeHtml(unit.codigo)}" data-route="quiz/${escapeHtml(course.key)}/${escapeHtml(unit.codigo)}">Cuestionario · 5 preguntas</a>
        <a class="button button--primary" href="#/exam/${escapeHtml(course.key)}" data-route="exam/${escapeHtml(course.key)}">Evaluación final · 35 preguntas</a>
      </div>
    </article>
    ${closePlayerNavigation()}`;
}
