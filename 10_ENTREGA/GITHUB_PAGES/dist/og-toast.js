let hideTimer;

export function showToast(message, kind = "info") {
  const region = document.querySelector("#toast-region");
  if (!region) return;
  window.clearTimeout(hideTimer);
  const toast = document.createElement("div");
  toast.className = `toast toast--${kind}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;
  region.replaceChildren(toast);
  hideTimer = window.setTimeout(() => {
    region.replaceChildren();
  }, 4000);
}
