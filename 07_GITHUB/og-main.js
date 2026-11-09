import { loadDemoData } from "./og-data.js";
import { createDemoState } from "./og-state.js";
import { renderApplication, navigate } from "./og-router.js";
import { bindActions, showSosResult } from "./og-actions.js";
import { openDatabase } from "./og-persistence-db.js";
import { hydratePersistentState } from "./og-persistence-bootstrap.js";
import { saveLastScreen, isRestorableRoute } from "./og-persistence-navigation.js";
import { saveCurrentCourse } from "./og-persistence-courses.js";
import { saveCourseProgress } from "./og-persistence-progress.js";
import { initializeTheme, applyTheme, getSystemTheme } from "./og-theme.js";
import { showToast } from "./og-toast.js";
import { bindSOSButton } from "./og-sos.js";
import { createStudyTracker } from "./og-lms-study-tracker.js";

const root = document.querySelector("#app");
const splash = document.querySelector("#splash");
const splashStartedAt = performance.now();
const splashDuration = 7000;
const allowedRoutes = new Set(["home", "operations", "academy", "profile"]);

let state;
let unbindSOSButton = () => {};
let updateStudyRoute = () => {};

function currentPath() {
  return window.location.hash.replace(/^#\/?/, "");
}

function routeParts(path) {
  return path.split("/").filter(Boolean);
}

function currentCourseForRoute(parts) {
  return state.data.courses.find((course) => course.key === parts[1]);
}

async function persistRouteState() {
  if (!state?.demoEntered) return;
  const path = currentPath();
  if (!routeIsSafe(path) || path === state.lastSavedRoute) return;

  state.lastSavedRoute = path;
  try {
    await saveLastScreen(path);
    state.lastScreen = path;

    const parts = routeParts(path);
    const [screen, , resourceCode] = parts;
    const course = currentCourseForRoute(parts);
    if (!course) return;

    const prior = state.progressByCourse[course.key];
    let unitCode = prior?.unitCode || state.currentCourse?.unitCode || course.unitCode || null;
    let lessonCode = prior?.lessonCode || state.currentCourse?.lessonCode || course.lessonCode || null;

    if (screen === "unit" || screen === "quiz") {
      const unit = state.data.units.find((item) => item.codigo === resourceCode && item.curso_codigo === course.code);
      if (!unit) return;
      unitCode = unit.codigo;
      lessonCode = state.data.lessons.find((item) => item.unidad_codigo === unit.codigo)?.codigo || null;
    } else if (screen === "activity" && course.key === "AVSEC") {
      const unit = state.data.avsecCourse.units.find((item) => item.activity.activity_id === resourceCode);
      if (!unit) return;
      unitCode = unit.unit_id;
      lessonCode = unit.lesson.lesson_id;
    } else if (screen === "lesson") {
      const lesson = state.data.lessons.find((item) => item.codigo === resourceCode);
      const unit = state.data.units.find((item) => item.codigo === lesson?.unidad_codigo);
      if (!lesson || !unit || unit.curso_codigo !== course.code) return;
      unitCode = unit.codigo;
      lessonCode = lesson.codigo;
    }

    const currentCourse = {
      courseKey: course.key,
      courseCode: course.code || null,
      unitCode,
      lessonCode
    };
    await saveCurrentCourse(currentCourse);
    state.currentCourse = currentCourse;
    state.resumeCourseKey = course.key;

    if (["unit", "lesson", "activity", "quiz", "flashcards", "exam", "results"].includes(screen)) {
      if (state.progressByCourse[course.key] !== prior) return;
      const lastActivity = {
        unit: "Unidad abierta",
        lesson: "Lección abierta",
        activity: "Actividad demo abierta",
        quiz: "Cuestionario demo abierto",
        flashcards: "Tarjetas demo abiertas",
        exam: "Examen demo abierto",
        results: "Resultados demo consultados"
      }[screen];
      const progress = await saveCourseProgress({
        ...currentCourse,
        contentVersion: course.key === "AVSEC" ? state.data.avsecCourse.content_version : null,
        percentComplete: prior?.percentComplete ?? course.progress,
        lastActivity: new Date().toISOString(),
        lastActivityLabel: lastActivity,
        userRef: state.data.user.employeeId
      });
      state.progressByCourse[course.key] = progress;
    }
  } catch (error) {
    state.lastSavedRoute = null;
    state.persistenceError = error instanceof Error ? error.message : String(error);
    showToast(`No se guardó la navegación en IndexedDB: ${state.persistenceError}`, "warning");
    renderApplication(root, state);
    updateStudyRoute();
  }
}

function render() {
  unbindSOSButton();
  renderApplication(root, state);
  updateStudyRoute();
  const sosButton = document.querySelector("[data-sos-button]");
  unbindSOSButton = bindSOSButton(
    sosButton,
    () => void showSosResult(state, render),
    (message) => {
      const hint = sosButton?.querySelector("#sos-instructions");
      if (hint) hint.textContent = message;
    }
  );
  void persistRouteState();
}

function dismissSplash(force = false) {
  const finish = () => {
    splash?.classList.add("is-leaving");
    window.setTimeout(() => {
      if (splash) splash.hidden = true;
      splash?.setAttribute("aria-hidden", "true");
    }, 300);
  };
  if (force) {
    finish();
    return;
  }
  const remaining = Math.max(0, splashDuration - (performance.now() - splashStartedAt));
  window.setTimeout(() => {
    finish();
  }, remaining);
}

function bindSplashSkip() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest('[data-action="skip-splash"]')) return;
    dismissSplash(true);
  });
}

function routeIsSafe(route) {
  if (!route) return false;
  if (allowedRoutes.has(route)) return true;
  if (!isRestorableRoute(route)) return false;
  const parts = routeParts(route);
  const course = currentCourseForRoute(parts);
  if (!course) return false;
  if (parts[0] === "course") return true;
  if (parts[0] === "exam") return course.key === "AVSEC" && Boolean(state.data.avsecExam);
  if (parts[0] === "unit") {
    return state.data.units.some((unit) => unit.codigo === parts[2] && unit.curso_codigo === course.code);
  }
  if (parts[0] === "lesson") {
    const lesson = state.data.lessons.find((item) => item.codigo === parts[2]);
    return state.data.units.some((unit) => unit.codigo === lesson?.unidad_codigo && unit.curso_codigo === course.code);
  }
  if (parts[0] === "activity") {
    return course.key === "AVSEC"
      && state.data.avsecCourse.units.some((unit) => unit.activity.activity_id === parts[2]);
  }
  if (parts[0] === "quiz") {
    return state.data.units.some((unit) => unit.codigo === parts[2] && unit.curso_codigo === course.code);
  }
  if (parts[0] === "flashcards") {
    return false;
  }
  if (parts[0] === "results") {
    const result = state.examResultsById[parts[2]];
    return Boolean(result && result.courseKey === course.key);
  }
  return false;
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    showToast("Este navegador no admite Service Worker; la demo sigue disponible en línea.", "warning");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./service-worker.js");
    const worker = registration.installing;
    worker?.addEventListener("statechange", () => {
      if (worker.state === "redundant") {
        showToast("No se pudo completar la instalación de la caché estática.", "warning");
      }
    });
  } catch (error) {
    showToast(`No se registró el Service Worker: ${error instanceof Error ? error.message : String(error)}`, "warning");
  }
}

async function start() {
  bindSplashSkip();

  try {
    const data = await loadDemoData();
    state = createDemoState(data);

    try {
      await openDatabase();
      await hydratePersistentState(state);
      state.persistenceAvailable = true;
      if (state.lastScreen && !routeIsSafe(state.lastScreen)) state.lastScreen = null;
    } catch (error) {
      state.persistenceError = error instanceof Error ? error.message : String(error);
      showToast(`Persistencia local no disponible: ${state.persistenceError}`, "warning");
    }

    try {
      await initializeTheme(data.defaultConfiguration.tema);
    } catch (error) {
      applyTheme(getSystemTheme());
      state.persistenceError ||= error instanceof Error ? error.message : String(error);
      showToast(`No se pudo leer el tema guardado: ${state.persistenceError}`, "warning");
    }

    updateStudyRoute = createStudyTracker(state, (error) => {
      state.persistenceError = error instanceof Error ? error.message : String(error);
      showToast(`No se guardó el tiempo de estudio local: ${state.persistenceError}`, "warning");
    });

    const initialRoute = currentPath();
    if (initialRoute && initialRoute !== "login" && routeIsSafe(initialRoute)) {
      navigate("login");
    }

    bindActions(state, render);
    render();
    void registerServiceWorker();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    root.innerHTML = `<main class="fatal-error" role="alert"><h1>No se pudo iniciar OmniGuard</h1><p>${message.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character])}</p><p>Comprueba que los archivos de datos estén disponibles y recarga.</p></main>`;
  } finally {
    dismissSplash();
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("online", () => {
  if (state) render();
  showToast("Conexión disponible; la demo no sincroniza datos con ningún servidor.", "info");
});
window.addEventListener("offline", () => {
  if (state) render();
  showToast("Sin conexión; los datos locales siguen disponibles según el soporte del navegador.", "info");
});

start();
