export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function progressMarkup(value, label) {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <div class="progress-block">
      <div class="progress-block__label"><span>${escapeHtml(label)}</span><strong>${percent}%</strong></div>
      <div class="progress" role="progressbar" aria-label="${escapeHtml(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
        <span class="progress__value" style="width:${percent}%"></span>
      </div>
    </div>`;
}
