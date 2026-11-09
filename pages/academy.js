import { escapeHtml, progressMarkup } from "../app/html.js";
import { getResumeTarget } from "../app/learning.js";

function formatHours(seconds) {
  const hours = Math.max(0, Number(seconds) || 0) / 3600;
  return `${hours < 10 ? hours.toFixed(1) : Math.floor(hours)} h`;
}

function formatLastActivity(value) {
  if (!value) return "Sin actividad académica registrada";
  const date = Date.parse(value);
  return Number.isFinite(date)
    ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(date)
    : "Sin actividad académica registrada";
}

function formatDuration(minutes) {
  if (!minutes) return "Por definir";
  return minutes >= 60 ? `${Math.round(minutes / 60)} h` : `${minutes} min`;
}

export function renderAcademy(data, state) {
  const resume = getResumeTarget(data, state);
  const completed = data.courses.filter((course) => course.progress >= 100).length;
  const active = data.courses.filter((course) => course.progress > 0 && course.progress < 100).length;
  const latestActivity = state.lastLearningActivity
    ? formatLastActivity(state.lastLearningActivity)
    : resume?.lastActivity || "Sin actividad académica registrada";

  return `
    <section class="page-heading"><div><span class="eyebrow">LMS local · contenido de demostración</span><h1>Academia</h1><p class="muted">AVSEC está disponible para revisión didáctica. Mercancías Peligrosas y SMS se habilitarán próximamente.</p></div></section>
    ${resume ? `<section class="panel continue-panel">
      <div><span class="eyebrow">Continuar donde te quedaste</span><h2>${escapeHtml(resume.course.title)}</h2><p>${escapeHtml(resume.unitTitle || "Unidad pendiente")} · ${escapeHtml(resume.lessonTitle)}</p></div>
      ${progressMarkup(resume.percentComplete, "Avance guardado en este dispositivo")}
      <p class="helper-text">Última actividad: ${escapeHtml(resume.lastActivity)}</p>
      <a class="button button--primary" href="#/${escapeHtml(resume.route)}" data-route="${escapeHtml(resume.route)}">Continuar</a>
    </section>` : ""}
    <section class="section-block" aria-labelledby="academy-stats-heading">
      <div class="section-heading"><h2 id="academy-stats-heading">Resumen de aprendizaje</h2><span class="status-pill status-pill--demo">Datos locales</span></div>
      <div class="academy-stats">
        <article class="panel academy-stat"><span class="eyebrow">Cursos activos</span><strong>${active}</strong></article>
        <article class="panel academy-stat"><span class="eyebrow">Cursos completados</span><strong>${completed}</strong></article>
        <article class="panel academy-stat"><span class="eyebrow">Horas estudiadas</span><strong>${escapeHtml(formatHours(state.studySeconds))}</strong></article>
        <article class="panel academy-stat"><span class="eyebrow">Certificaciones</span><strong>0</strong><span class="helper-text">No disponibles en la demo</span></article>
      </div>
      <p class="helper-text">Última actividad académica: ${escapeHtml(latestActivity)}. El tiempo mide sesiones visibles de esta demo y no es una constancia de capacitación.</p>
    </section>
    <section class="section-block"><div class="section-heading"><h2>Cursos</h2><span class="status-pill status-pill--demo">3 fichas demo</span></div>
      <div class="course-grid">${data.courses.map((course) => `
        <article class="course-card">
          <img class="course-card__image" src="${escapeHtml(course.image)}" alt="Ilustración demo del curso ${escapeHtml(course.title)}" loading="lazy">
          <div class="course-card__top"><span class="course-tag">${escapeHtml(course.tag)}</span><span class="status-pill">${escapeHtml(course.status)}</span></div>
          <h3>${escapeHtml(course.title)}</h3><p>${escapeHtml(course.description)}</p>
          <dl class="course-meta">
            <div><dt>Duración</dt><dd>${formatDuration(course.durationMinutes)}</dd></div>
            <div><dt>Unidades</dt><dd>${course.unitCount}</dd></div>
            <div><dt>Evaluación</dt><dd>${course.evaluationQuestionCount ? `${course.evaluationQuestionCount} preguntas · demo` : "Próximamente"}</dd></div>
          </dl>
          ${progressMarkup(course.progress, "Progreso local")}
          <a class="button button--secondary" href="#/course/${escapeHtml(course.key)}" data-route="course/${escapeHtml(course.key)}">Abrir curso</a>
        </article>`).join("")}</div>
    </section>
    <p class="inline-notice">El contenido, la evaluación y el progreso AVSEC son demostrativos, están en revisión editorial y no acreditan formación ni certificación.</p>`;
}
