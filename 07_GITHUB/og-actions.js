import { navigate } from "./og-router.js";
import { toggleTheme } from "./og-theme.js";
import { openBottomSheet, closeBottomSheet, renderReportForm, renderSOSSimulation } from "./og-bottom-sheet.js";
import { showToast } from "./og-toast.js";
import { createLogbookEntry } from "./og-persistence-logbook.js";
import { saveIncidentBundle } from "./og-persistence-incidents.js";
import { saveCourseProgress } from "./og-persistence-progress.js";
import { saveEvaluationState } from "./og-persistence-evaluations.js";
import { saveSosSimulation } from "./og-persistence-sos.js";
import { handleLmsAction, handleLmsChange } from "./og-lms-actions.js";

function localMoment() {
  const date = new Date();
  return {
    occurredAt: date.toISOString(),
    localDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    localTime: new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date)
  };
}

function displayTime(value) {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

function timelineEntry(record) {
  return {
    id: record.id,
    category: record.entityType,
    title: record.title,
    detail: record.detail,
    time: `${record.localDate} · ${record.localTime}`,
    status: "Guardado en este dispositivo",
    evidenceCount: record.evidenceIds?.length || 0,
    occurredAt: record.occurredAt
  };
}

function routeCourseKey() {
  return window.location.hash.replace(/^#\/?/, "").split("/")[1] || null;
}

function makeLogbookRecord(state, entityType, action, title, detail, moment = localMoment()) {
  return {
    actorId: state.data.user.employeeId,
    entityType,
    action,
    title,
    detail,
    occurredAt: moment.occurredAt,
    localDate: moment.localDate,
    localTime: moment.localTime
  };
}

function addPreview(event, state) {
  const input = event.target.closest("[data-attachment]");
  if (!input) return;
  const preview = input.closest(".field")?.querySelector("[data-attachment-preview]");
  if (!preview) return;

  if (input.dataset.previewUrl) {
    URL.revokeObjectURL(input.dataset.previewUrl);
    state.attachmentUrls = state.attachmentUrls.filter((url) => url !== input.dataset.previewUrl);
    delete input.dataset.previewUrl;
  }
  preview.replaceChildren();
  const file = input.files?.[0];
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  input.dataset.previewUrl = objectUrl;
  state.attachmentUrls.push(objectUrl);
  const description = document.createElement("p");
  description.textContent = `${file.name} · ${(file.size / 1024).toFixed(0)} KB · se guardará solo localmente`;
  preview.append(description);

  let media;
  if (file.type.startsWith("image/")) {
    media = document.createElement("img");
    media.alt = "Vista previa local del archivo seleccionado";
  } else if (file.type.startsWith("video/")) {
    media = document.createElement("video");
    media.controls = true;
    media.setAttribute("aria-label", "Vista previa local del video");
  } else if (file.type.startsWith("audio/")) {
    media = document.createElement("audio");
    media.controls = true;
    media.setAttribute("aria-label", "Vista previa local del audio");
  }
  if (media) {
    media.src = objectUrl;
    preview.append(media);
  }
}

async function saveTurnEvent(state, render, action, title, detail) {
  const wasCheckedIn = state.checkedIn;
  const wasCheckedOut = state.checkedOut;
  if (action === "CHECK_IN") state.checkedIn = true;
  if (action === "CHECK_OUT") state.checkedOut = true;
  render();

  try {
    const record = await createLogbookEntry(makeLogbookRecord(state, "TURNO", action, title, detail));
    state.events.unshift(timelineEntry(record));
    render();
    showToast(`${title}. Guardado localmente; no es una marca oficial.`, "success");
  } catch (error) {
    state.checkedIn = wasCheckedIn;
    state.checkedOut = wasCheckedOut;
    render();
    showToast(`No se guardó ${title.toLowerCase()} en IndexedDB: ${errorText(error)}`, "warning");
  }
}

async function saveCurrentProgress(state, course, changes) {
  const previous = state.progressByCourse[course.key];
  const moment = localMoment();
  const record = await saveCourseProgress({
    courseKey: course.key,
    courseCode: course.code || null,
    unitCode: changes.unitCode ?? previous?.unitCode ?? course.unitCode ?? null,
    lessonCode: changes.lessonCode ?? previous?.lessonCode ?? course.lessonCode ?? null,
    percentComplete: changes.percentComplete ?? previous?.percentComplete ?? course.progress,
    lastActivity: moment.occurredAt,
    lastActivityLabel: changes.lastActivityLabel ?? previous?.lastActivityLabel ?? "Progreso actualizado",
    userRef: state.data.user.employeeId
  });
  state.progressByCourse[course.key] = record;
  state.resumeCourseKey = course.key;
  state.data.courses = state.data.courses.map((item) => item.key === course.key
    ? { ...item, progress: record.percentComplete }
    : item);
  return record;
}

async function saveReport(event, state, render) {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const category = String(formData.get("category") || "Incidente");
  const description = String(formData.get("description") || "").trim();
  const files = [...form.querySelectorAll("[data-attachment]")].flatMap((input) => [...(input.files || [])]);
  const invalidFile = files.find((file) => !["image/", "video/", "audio/"].some((prefix) => file.type.startsWith(prefix)));
  if (invalidFile) {
    showToast(`Tipo de archivo no admitido: ${invalidFile.name}`, "warning");
    return;
  }

  const moment = localMoment();
  const evidences = files.map((file) => ({
    mediaType: file.type.startsWith("image/") ? "FOTO" : file.type.startsWith("video/") ? "VIDEO" : "AUDIO",
    mimeType: file.type,
    originalName: file.name,
    sizeBytes: file.size,
    content: file
  }));
  const incident = {
    reporterId: state.data.user.employeeId,
    category,
    description,
    occurredAt: moment.occurredAt,
    localDate: moment.localDate,
    localTime: moment.localTime
  };
  const logbook = makeLogbookRecord(
    state,
    "INCIDENTE",
    "CREADO_LOCAL",
    `${category} demo`,
    description,
    moment
  );

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Guardando localmente…";
  }
  try {
    const saved = await saveIncidentBundle(incident, evidences, logbook);
    state.incidents.unshift(saved.incident);
    state.events.unshift(timelineEntry(saved.logbook));
    closeBottomSheet();
    render();
    showToast(`Incidente y ${saved.evidences.length} evidencia(s) guardados en este dispositivo.`, "success");
  } catch (error) {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Agregar a la demo";
    }
    showToast(`No se guardó el reporte; verifica el espacio disponible. ${errorText(error)}`, "warning");
  }
}

export async function showSosResult(state, render) {
  openBottomSheet(renderSOSSimulation());
  const moment = localMoment();
  const results = [
    "Llamada simulada",
    "Email simulado",
    "SMS simulado",
    "WhatsApp simulado",
    "Ubicación compartida simulada"
  ];
  const record = {
    employeeId: state.data.user.employeeId,
    userName: state.data.user.name,
    simulatedLocation: "Ubicación demo (texto demo; sin geolocalización real)",
    results,
    result: "Canales y ubicación solo simulados."
  };
  const logbook = makeLogbookRecord(
    state,
    "SOS",
    "SIMULACION",
    "SOS simulado",
    "Canales de contacto y ubicación simulados; no se contactó ningún servicio.",
    moment
  );

  try {
    const saved = await saveSosSimulation(record, logbook);
    state.sosHistory.unshift(saved.sos);
    state.events.unshift(timelineEntry(saved.logbook));
    render();
    showToast("Historial SOS guardado localmente; no se envió ninguna alerta.", "info");
  } catch (error) {
    showToast(`La simulación se mostró, pero no se guardó el histórico SOS: ${errorText(error)}`, "warning");
  }
}

export function bindActions(state, render) {
  document.addEventListener("click", async (event) => {
    const routeTarget = event.target.closest("[data-route]");
    if (routeTarget) {
      event.preventDefault();
      navigate(routeTarget.dataset.route);
      return;
    }

    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (await handleLmsAction(action, target, state, render)) return;

    if (action === "demo-login") {
      state.demoEntered = true;
      if (!navigate(state.lastScreen || "home")) render();
    } else if (action === "demo-logout") {
      state.demoEntered = false;
      navigate("login");
    } else if (action === "check-in" && !state.checkedIn && !state.checkedOut) {
      await saveTurnEvent(state, render, "CHECK_IN", "Entrada registrada", "Marcaje demo guardado localmente; no es asistencia oficial.");
    } else if (action === "check-out" && state.checkedIn && !state.checkedOut) {
      await saveTurnEvent(state, render, "CHECK_OUT", "Salida registrada", "Marcaje demo guardado localmente; no se envió a un servidor.");
    } else if (action === "next-consigna" || action === "previous-consigna") {
      const length = state.data.consignas.length;
      const delta = action === "next-consigna" ? 1 : -1;
      state.consignaIndex = (state.consignaIndex + delta + length) % length;
      render();
    } else if (action === "filter-events") {
      state.eventFilter = target.dataset.filter || "TODOS";
      render();
    } else if (action === "open-report") {
      openBottomSheet(renderReportForm());
    } else if (action === "close-sheet") {
      closeBottomSheet();
    } else if (action === "toggle-theme") {
      const result = await toggleTheme();
      render();
      showToast(result.persisted
        ? `Modo ${result.theme === "dark" ? "oscuro" : "claro"} guardado en este dispositivo.`
        : `Tema cambiado solo en pantalla; no se pudo guardar: ${errorText(result.error)}`,
      result.persisted ? "info" : "warning");
    } else if (action === "complete-lesson") {
      const courseKey = routeCourseKey();
      const course = state.data.courses.find((item) => item.key === courseKey);
      if (!course) return;
      try {
        await saveCurrentProgress(state, course, {
          percentComplete: 100,
          lastActivityLabel: "Lección demostrativa completada"
        });
        render();
        showToast("Progreso de la lección guardado localmente.", "success");
      } catch (error) {
        showToast(`No se guardó el progreso: ${errorText(error)}`, "warning");
      }
    } else if (action === "submit-exam") {
      const courseKey = routeCourseKey();
      const attempt = state.evaluationsByCourse[courseKey];
      if (!attempt || typeof attempt.choice !== "number" || attempt.submitted) return;
      const submittedAt = new Date().toISOString();
      try {
        const saved = await saveEvaluationState(courseKey, {
          choice: attempt.choice,
          submitted: true,
          submittedAt,
          status: "DEMO_NO_CALIFICADO"
        });
        state.evaluationsByCourse[courseKey] = saved;
        render();
        showToast("Respuesta de demostración guardada localmente; no se calificó.", "info");
      } catch (error) {
        showToast(`No se guardó el estado de evaluación: ${errorText(error)}`, "warning");
      }
    } else if (action === "toggle-calendar") {
      state.calendarExpanded = !state.calendarExpanded;
      render();
    }
  });

  document.addEventListener("change", async (event) => {
    if (await handleLmsChange(event, state, render)) return;

    const option = event.target.closest('input[name="demo-answer"]');
    if (option) {
      const courseKey = routeCourseKey();
      const attempt = {
        ...(state.evaluationsByCourse[courseKey] || {}),
        choice: Number(option.value),
        submitted: false,
        status: "DEMO_BORRADOR"
      };
      try {
        const saved = await saveEvaluationState(courseKey, attempt);
        state.evaluationsByCourse[courseKey] = saved;
        render();
        showToast("Selección de evaluación guardada localmente.", "success");
      } catch (error) {
        state.evaluationsByCourse[courseKey] = attempt;
        render();
        showToast(`La selección queda solo en memoria; no se guardó: ${errorText(error)}`, "warning");
      }
      return;
    }
    addPreview(event, state);
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "incident-form") void saveReport(event, state, render);
  });

  document.querySelector("#bottom-sheet")?.addEventListener("close", () => {
    state.attachmentUrls.forEach((url) => URL.revokeObjectURL(url));
    state.attachmentUrls = [];
  });
}
