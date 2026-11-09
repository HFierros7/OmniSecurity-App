import { escapeHtml } from "./og-html.js";

export function renderLogin(data) {
  const logo = document.documentElement.dataset.theme === "dark"
    ? document.body.dataset.logoDark
    : document.body.dataset.logoLight;
  return `
    <main id="main-content" class="login-page" tabindex="-1">
      <section class="login-card" aria-labelledby="login-title">
        <img class="login-card__logo" data-brand-logo src="${escapeHtml(logo)}" alt="OmniGuard">
        <span class="eyebrow">Prototipo navegable</span>
        <h1 id="login-title">Seguridad operativa</h1>
        <p class="muted">Ingreso de demostración. No hay autenticación ni validación de credenciales.</p>
        <div class="demo-identity">
          <span>Usuario demo</span><strong>${escapeHtml(data.user.name)}</strong>
          <span>Empleado</span><strong>${escapeHtml(data.user.employeeId)}</strong>
        </div>
        <button class="button button--primary button--full" type="button" data-action="demo-login">Ingresar</button>
        <p class="login-card__notice">No escribas ni uses contraseñas reales en esta demo.</p>
      </section>
    </main>`;
}
