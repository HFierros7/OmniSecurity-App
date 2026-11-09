import { escapeHtml } from "../app/html.js";
import { closePlayerNavigation, renderPlayerNavigation } from "../components/lms-player.js";

export function renderActivity(state, courseKey, activityCode) {
  const course = state.data.courses.find((item) => item.key === courseKey);
  const unitContent = courseKey === "AVSEC"
    ? state.data.avsecCourse.units.find((item) => item.activity.activity_id === activityCode)
    : null;
  if (!course || !unitContent) {
    return `<section class="empty-state"><h1>Actividad no disponible</h1><a href="#/academy" data-route="academy">Volver a Academia</a></section>`;
  }
  const lesson = state.data.lessons.find((item) => item.codigo === unitContent.lesson.lesson_id);
  const unit = state.data.units.find((item) => item.codigo === unitContent.unit_id);
  const recordId = `${courseKey}:${activityCode}`;
  const record = state.activitiesById[recordId];
  const response = record?.response || "";

  return `
    <section class="page-heading"><div><span class="eyebrow">Actividad interactiva · ${escapeHtml(unitContent.title)}</span><h1>${escapeHtml(unitContent.activity.title)}</h1></div><span class="status-pill status-pill--demo">Práctica demo</span></section>
    ${renderPlayerNavigation(course, "activity", unit, lesson)}
    <section class="panel">
      <p>${escapeHtml(unitContent.activity.instructions)}</p>
      <fieldset class="exam-options"><legend>Selecciona una respuesta</legend>
        ${unitContent.activity.options.map((option) => `<label class="exam-option"><input type="radio" name="activity-answer" value="${escapeHtml(option.id)}" ${response === option.id ? "checked" : ""}><span>${escapeHtml(option.text)}</span></label>`).join("")}
      </fieldset>
      <div class="button-row">
        <button class="button button--primary" type="button" data-action="save-activity" data-course="${escapeHtml(courseKey)}" data-activity="${escapeHtml(activityCode)}">${record?.completedAt ? "Actualizar respuesta guardada" : "Guardar respuesta"}</button>
        <a class="button button--secondary" href="#/lesson/${escapeHtml(courseKey)}/${escapeHtml(unitContent.lesson.lesson_id)}" data-route="lesson/${escapeHtml(courseKey)}/${escapeHtml(unitContent.lesson.lesson_id)}">Volver a lección</a>
      </div>
      ${record?.completedAt ? `<div class="inline-notice" role="status"><strong>${record.correct ? "Criterio esperado seleccionado." : "Respuesta guardada para revisión."}</strong><p>${escapeHtml(unitContent.activity.feedback)}</p><p>La respuesta se guarda en este dispositivo y no acredita aprendizaje.</p></div>` : ""}
    </section>
    ${closePlayerNavigation()}`;
}
