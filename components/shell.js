import { escapeHtml } from "../app/html.js";

const destinations = [
  ["home", "Inicio"],
  ["operations", "Operaciones"],
  ["academy", "Academia"],
  ["profile", "Perfil"]
];

function navItems(active, className) {
  return destinations.map(([route, label]) => `
    <a class="${className}__link${active === route ? " is-active" : ""}"
       href="#/${route}" data-route="${route}"${active === route ? ' aria-current="page"' : ""}>
      <span>${label}</span>
    </a>`).join("");
}

export function renderShell({ data, state, active, content }) {
  const logo = document.documentElement.dataset.theme === "dark"
    ? document.body.dataset.logoDark
    : document.body.dataset.logoLight;
  const persistenceMessage = state.persistenceAvailable
    ? state.persistenceError
      ? `IndexedDB disponible; el último guardado falló: ${state.persistenceError}`
      : "Persistencia local IndexedDB activa en este dispositivo."
    : `Cambios temporales: IndexedDB no disponible. ${state.persistenceError}`;

  return `
    <div class="app-shell">
      <aside class="sidebar" aria-label="Navegación principal">
        <a class="sidebar__brand" href="#/home" data-route="home">
          <img data-brand-logo src="${escapeHtml(logo)}" alt="">
          <span>OmniGuard</span>
        </a>
        <nav class="sidebar__nav">${navItems(active, "sidebar")}</nav>
        <p class="sidebar__demo">Prototipo demo</p>
      </aside>

      <div class="app-shell__body">
        <header class="app-header">
          <a class="app-header__brand" href="#/home" data-route="home">
            <img data-brand-logo src="${escapeHtml(logo)}" alt="">
            <span>${escapeHtml(data.company)}</span>
          </a>
          <div class="app-header__actions">
            <span class="connection-status" data-connection-status>${navigator.onLine ? "En línea" : "Sin conexión"}</span>
            <button class="icon-button" type="button" data-action="toggle-theme" aria-label="Cambiar tema claro u oscuro">
              <span aria-hidden="true">${document.documentElement.dataset.theme === "dark" ? "☼" : "◐"}</span>
              <span class="desktop-only">Apariencia</span>
            </button>
            <span class="app-header__user">${escapeHtml(data.user.employeeId)}</span>
          </div>
        </header>

        <main id="main-content" class="main-content" tabindex="-1">
          <div class="demo-notice"><strong>DEMO</strong><span>Datos locales; sin servidor</span></div>
          <p class="persistence-status${state.persistenceAvailable && !state.persistenceError ? "" : " persistence-status--warning"}" role="${state.persistenceAvailable && !state.persistenceError ? "status" : "alert"}">
            ${escapeHtml(persistenceMessage)}
          </p>
          ${content}
        </main>
      </div>

      <nav class="bottom-nav" aria-label="Navegación principal">${navItems(active, "bottom-nav")}</nav>
      <button class="sos-launcher" type="button" data-sos-button aria-describedby="sos-instructions">
        <span class="sos-launcher__label">SOS</span>
        <span id="sos-instructions" class="sos-launcher__hint">Mantén presionado 3 segundos · simulación</span>
      </button>
    </div>`;
}
