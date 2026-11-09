import { renderShell } from "./og-shell.js";
import { renderLogin } from "./og-page-login.js";
import { renderHome } from "./og-page-home.js";
import { renderOperations } from "./og-page-operations.js";
import { renderAcademy } from "./og-page-academy.js";
import { renderCourse } from "./og-page-course.js";
import { renderUnit } from "./og-page-unit.js";
import { renderLesson } from "./og-page-lesson.js";
import { renderExam } from "./og-page-exam.js";
import { renderActivity } from "./og-page-activity.js";
import { renderQuiz } from "./og-page-quiz.js";
import { renderFlashcards } from "./og-page-flashcards.js";
import { renderResults } from "./og-page-results.js";
import { renderProfile } from "./og-page-profile.js";

function currentRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const parts = raw.split("/").filter(Boolean).map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return "";
    }
  });
  return { name: parts[0] || "login", params: parts.slice(1) };
}

export function navigate(path) {
  const safePath = String(path).replace(/^#?\/?/, "");
  const hash = `#/${safePath}`;
  if (window.location.hash === hash) return false;
  window.location.hash = `/${safePath}`;
  return true;
}

export function renderApplication(root, state) {
  const route = currentRoute();
  if (route.name === "login" || !state.demoEntered) {
    root.innerHTML = renderLogin(state.data);
    return;
  }

  const [first, second] = route.params;
  const pages = {
    home: () => renderHome(state.data, state),
    operations: () => renderOperations(state),
    academy: () => renderAcademy(state.data, state),
    course: () => renderCourse(state.data, state, first),
    unit: () => renderUnit(state.data, first, second),
    lesson: () => renderLesson(state.data, state, first, second),
    activity: () => renderActivity(state, first, second),
    quiz: () => renderQuiz(state.data, state, first, second),
    flashcards: () => renderFlashcards(state.data, state, first, second),
    exam: () => renderExam(state.data, state, first),
    results: () => renderResults(state, first, second),
    profile: () => renderProfile(state.data, state)
  };
  const page = pages[route.name] || pages.home;
  root.innerHTML = renderShell({
    data: state.data,
    state,
    active: ["course", "unit", "lesson", "activity", "quiz", "flashcards", "exam", "results"].includes(route.name)
      ? "academy"
      : pages[route.name]
        ? route.name
        : "home",
    content: page()
  });
}
