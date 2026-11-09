const HOLD_MS = 3000;

export function bindSOSButton(button, onComplete, onStatus) {
  if (!button || button.dataset.bound === "true") return () => {};
  button.dataset.bound = "true";
  let timer = 0;
  let active = false;

  const cancel = () => {
    if (!active) return;
    active = false;
    window.clearTimeout(timer);
    button.classList.remove("is-holding");
    onStatus("Mantén presionado 3 segundos para simular SOS.");
  };

  const start = () => {
    if (active) return;
    active = true;
    button.classList.add("is-holding");
    onStatus("Manteniendo presionado. La simulación se activa al completar 3 segundos.");
    timer = window.setTimeout(() => {
      active = false;
      button.classList.remove("is-holding");
      onComplete();
    }, HOLD_MS);
  };

  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    button.setPointerCapture?.(event.pointerId);
    start();
  };
  const onKeyDown = (event) => {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      start();
    }
  };
  const onKeyUp = (event) => {
    if (event.key === " " || event.key === "Enter") cancel();
  };

  button.addEventListener("pointerdown", onPointerDown);
  button.addEventListener("pointerup", cancel);
  button.addEventListener("pointercancel", cancel);
  button.addEventListener("lostpointercapture", cancel);
  button.addEventListener("keydown", onKeyDown);
  button.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", cancel);

  return () => {
    cancel();
    button.removeEventListener("pointerdown", onPointerDown);
    button.removeEventListener("pointerup", cancel);
    button.removeEventListener("pointercancel", cancel);
    button.removeEventListener("lostpointercapture", cancel);
    button.removeEventListener("keydown", onKeyDown);
    button.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", cancel);
    delete button.dataset.bound;
  };
}
