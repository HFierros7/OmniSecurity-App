import { escapeHtml } from "./og-html.js";

const filters = [
  ["TODOS", "Todos"],
  ["CONSIGNA", "Consignas"],
  ["INCIDENTE", "Incidentes"],
  ["EQUIPO", "Equipo"],
  ["TURNO", "Turnos"],
  ["SOS", "SOS"]
];

export function renderOperations(state) {
  const visibleEvents = state.eventFilter === "TODOS"
    ? state.events
    : state.events.filter((event) => event.category === state.eventFilter);

  return `
    <section class="page-heading">
      <div><span class="eyebrow">Módulo</span><h1>Operaciones</h1><p class="muted">Bitácora visual de demostración.</p></div>
      <button class="button button--primary" type="button" data-action="open-report">Nuevo Reporte</button>
    </section>
    <section class="panel">
      <div class="panel-heading"><div><span class="eyebrow">Actividad</span><h2>Timeline</h2></div><span class="status-pill status-pill--demo">Almacenamiento local</span></div>
      <div class="filter-row" role="group" aria-label="Filtrar bitácora">
        ${filters.map(([value, label]) => `<button class="filter-chip${state.eventFilter === value ? " is-selected" : ""}" type="button" data-action="filter-events" data-filter="${value}" aria-pressed="${state.eventFilter === value}">${label}</button>`).join("")}
      </div>
      <ol class="timeline">
        ${visibleEvents.length ? visibleEvents.map((event) => `
          <li class="timeline-item">
            <span class="timeline-item__marker" aria-hidden="true"></span>
            <div class="timeline-item__body"><div class="timeline-item__heading"><strong>${escapeHtml(event.title)}</strong><time>${escapeHtml(event.time)}</time></div>
            <p>${escapeHtml(event.detail)}</p>${event.evidenceCount ? `<p class="helper-text">${event.evidenceCount} evidencia(s) guardadas en este dispositivo.</p>` : ""}<span class="status-pill">${escapeHtml(event.status)}</span></div>
          </li>`).join("") : '<li class="empty-state">No hay eventos para este filtro.</li>'}
      </ol>
    </section>
    <p class="helper-text">Los registros persistidos son locales, no tienen folio oficial y no se envían a ningún servidor.</p>`;
}
