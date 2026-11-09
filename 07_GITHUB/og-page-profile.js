import { escapeHtml } from "./og-html.js";

export function renderProfile(data, state) {
  return `
    <section class="page-heading"><div><span class="eyebrow">Cuenta</span><h1>Perfil</h1></div></section>
    <div class="profile-grid">
      <section class="panel profile-card"><div class="avatar" aria-hidden="true">CM</div><div><span class="eyebrow">Oficial · demo</span><h2>${escapeHtml(data.user.name)}</h2><p>${escapeHtml(data.user.employeeId)} · Grupo de ${escapeHtml(data.user.group)}</p></div></section>
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">Operaciones</span><h2>Equipo asignado</h2></div></div><p>${escapeHtml(data.equipment.label)}</p><span class="status-pill status-pill--demo">${escapeHtml(data.equipment.status)}</span></section>
      <section class="panel calendar-panel"><div class="panel-heading"><div><span class="eyebrow">Calendario</span><h2>Turno 24x24</h2></div><button class="button button--secondary" type="button" data-action="toggle-calendar">${state.calendarExpanded ? "Vista compacta" : "Ver calendario demo"}</button></div>
        <p class="helper-text">Patrón ilustrativo, no es una asignación real.</p>
        <div class="calendar-strip">${data.calendarPattern.map((label, index) => `<div class="calendar-cell${index === 0 ? " calendar-cell--today" : ""}"><span>Día ${index + 1}</span><strong>${escapeHtml(label)}</strong></div>`).join("")}</div>
        ${state.calendarExpanded ? '<p class="inline-notice">Calendario de ejemplo; confirma el rol y horario con la fuente operativa.</p>' : ""}
      </section>
      <section class="panel settings-panel"><div class="panel-heading"><div><span class="eyebrow">Preferencias</span><h2>Configuración</h2></div></div>
        <button class="setting-row" type="button" data-action="toggle-theme"><span>Modo claro / oscuro</span><span aria-hidden="true">◐</span></button>
        <p class="helper-text">La preferencia de apariencia se guarda en IndexedDB de este navegador.</p>
        <button class="button button--secondary" type="button" data-action="demo-logout">Salir de la demo</button>
      </section>
    </div>`;
}
