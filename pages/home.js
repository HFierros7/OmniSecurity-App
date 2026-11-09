import { escapeHtml, progressMarkup } from "../app/html.js";
import { getResumeTarget } from "../app/learning.js";

export function renderHome(data, state) {
  const consigna = data.consignas[state.consignaIndex % data.consignas.length];
  const resume = getResumeTarget(data, state);
  const attendanceLabel = state.checkedOut
    ? "Salida registrada (demo)"
    : state.checkedIn
      ? "Entrada registrada (demo)"
      : "Sin marcaje en esta sesión";

  return `
    <section class="page-heading">
      <div><span class="eyebrow">Inicio</span><h1>Hola, ${escapeHtml(data.user.name)}</h1></div>
      <span class="status-pill status-pill--demo">Grupo de ${escapeHtml(data.user.group)}</span>
    </section>
    <section class="client-banner" aria-label="Servicio de demostración">
      <div><span class="eyebrow">Cliente · datos demo</span><h2>${escapeHtml(data.client.name)}</h2><p>${escapeHtml(data.client.site)}</p></div>
      <span class="demo-badge">No oficial</span>
    </section>
    <div class="dashboard-grid">
      <section class="panel shift-card" aria-labelledby="shift-title">
        <div class="panel-heading"><div><span class="eyebrow">Turno asignado</span><h2 id="shift-title">${escapeHtml(data.shift.label)}</h2></div><span class="status-pill">${escapeHtml(data.shift.status)}</span></div>
        <p class="shift-card__status" role="status">${attendanceLabel}</p>
        <div class="button-row">
          <button class="button button--primary" type="button" data-action="check-in" ${state.checkedIn || state.checkedOut ? "disabled" : ""}>Registrar Entrada</button>
          <button class="button button--secondary" type="button" data-action="check-out" ${!state.checkedIn || state.checkedOut ? "disabled" : ""}>Registrar Salida</button>
        </div>
        <p class="helper-text">Simulación local; no registra asistencia oficial.</p>
      </section>
      <section class="panel consigna-card" aria-labelledby="consigna-title">
        <div class="panel-heading"><div><span class="eyebrow">Consignas</span><h2 id="consigna-title">Instrucciones vigentes</h2></div><span class="counter">${state.consignaIndex + 1}/${data.consignas.length}</span></div>
        <article class="consigna-slide"><h3>${escapeHtml(consigna.title)}</h3><p>${escapeHtml(consigna.description)}</p><span class="helper-text">Contenido ilustrativo, no es una consigna operativa.</span></article>
        <div class="carousel-controls">
          <button class="button button--secondary" type="button" data-action="previous-consigna" aria-label="Consigna anterior">Anterior</button>
          <button class="button button--secondary" type="button" data-action="next-consigna" aria-label="Siguiente consigna">Siguiente</button>
        </div>
      </section>
      <section class="panel course-resume">
        <div class="panel-heading"><div><span class="eyebrow">Academia</span><h2>Continuar donde te quedaste</h2></div></div>
        <h3>${escapeHtml(resume.course.title)}</h3>
        <p>${escapeHtml(resume.unitTitle || "Unidad pendiente")} · ${escapeHtml(resume.lessonTitle)}</p>
        ${progressMarkup(resume.percentComplete, "Progreso guardado en este dispositivo")}
        <p class="helper-text">Última actividad: ${escapeHtml(resume.lastActivity)}</p>
        <a class="button button--primary" href="#/${escapeHtml(resume.route)}" data-route="${escapeHtml(resume.route)}">Continuar curso</a>
      </section>
      <section class="panel quick-links">
        <div class="panel-heading"><div><span class="eyebrow">Acceso rápido</span><h2>Operaciones</h2></div></div>
        <div class="quick-link-grid">
          <a class="quick-link" href="#/operations" data-route="operations">Bitácora y reportes</a>
          <a class="quick-link" href="#/profile" data-route="profile">Calendario 24x24</a>
        </div>
      </section>
    </div>`;
}
