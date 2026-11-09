export function openBottomSheet(content) {
  const dialog = document.querySelector("#bottom-sheet");
  const host = document.querySelector("#sheet-content");
  if (!dialog || !host) return;
  host.innerHTML = content;
  dialog.showModal();
  host.querySelector("[data-autofocus]")?.focus();
}

export function closeBottomSheet() {
  const dialog = document.querySelector("#bottom-sheet");
  if (dialog?.open) dialog.close();
}

export function renderReportForm() {
  return `
    <div class="sheet-heading">
      <div><span class="eyebrow">Formulario demo</span><h2 id="sheet-title">Nuevo reporte</h2></div>
      <button class="icon-button" type="button" data-action="close-sheet" aria-label="Cerrar formulario">Cerrar</button>
    </div>
    <p class="muted">Reporte y adjuntos se guardan en IndexedDB de este navegador. No se envían a un servidor; no adjuntar evidencias reales.</p>
    <form id="incident-form" class="form-stack">
      <label class="field"><span>Tipo de reporte</span>
        <select name="category" required>
          <option value="Incidente">Incidente</option>
          <option value="Observación">Observación</option>
          <option value="Novedad de turno">Novedad de turno</option>
        </select>
      </label>
      <label class="field"><span>Descripción</span>
        <textarea name="description" rows="4" maxlength="500" required data-autofocus placeholder="Escribe una descripción de demostración"></textarea>
      </label>
      <fieldset class="attachment-fieldset">
        <legend>Adjuntar evidencia local (sin carga)</legend>
        <label class="field"><span>Foto</span><input type="file" accept="image/*" capture="environment" data-attachment><div class="attachment-preview" data-attachment-preview aria-live="polite"></div></label>
        <label class="field"><span>Video</span><input type="file" accept="video/*" data-attachment><div class="attachment-preview" data-attachment-preview aria-live="polite"></div></label>
        <label class="field"><span>Audio</span><input type="file" accept="audio/*" data-attachment><div class="attachment-preview" data-attachment-preview aria-live="polite"></div></label>
      </fieldset>
      <div class="button-row">
        <button class="button button--secondary" type="button" data-action="close-sheet">Cancelar</button>
        <button class="button button--primary" type="submit">Agregar a la demo</button>
      </div>
    </form>`;
}

export function renderSOSSimulation() {
  return `
    <div class="sheet-heading">
      <div><span class="eyebrow">Simulación local</span><h2 id="sheet-title">SOS activado</h2></div>
      <button class="icon-button" type="button" data-action="close-sheet" aria-label="Cerrar resultado">Cerrar</button>
    </div>
    <p role="status">No se contactó ningún servicio ni se obtuvo ubicación real. El historial de esta simulación se guarda localmente.</p>
    <ul class="simulation-list">
      <li><span aria-hidden="true">✓</span> Llamada enviada <strong>Simulado</strong></li>
      <li><span aria-hidden="true">✓</span> Email enviado <strong>Simulado</strong></li>
      <li><span aria-hidden="true">✓</span> SMS enviado <strong>Simulado</strong></li>
      <li><span aria-hidden="true">✓</span> WhatsApp enviado <strong>Simulado</strong></li>
      <li><span aria-hidden="true">✓</span> Ubicación compartida <strong>Simulado</strong></li>
    </ul>
    <button class="button button--secondary button--full" type="button" data-action="close-sheet">Cerrar</button>`;
}
