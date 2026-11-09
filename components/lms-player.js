import { escapeHtml } from "../app/html.js";

const PLAYER_ROUTES = {
  course: "Curso",
  unit: "Unidad",
  lesson: "Lección",
  activity: "Actividad",
  quiz: "Cuestionario · práctica",
  flashcards: "Tarjetas",
  exam: "Evaluación final · demo"
};

export function renderPlayerNavigation(course, routeName, unit, lesson) {
  const crumbs = [
    { label: "Academia", route: "academy" },
    { label: course.title, route: `course/${course.key}` }
  ];
  if (unit) crumbs.push({ label: unit.titulo, route: `unit/${course.key}/${unit.codigo}` });
  if (lesson) crumbs.push({ label: lesson.titulo || "Lección", route: `lesson/${course.key}/${lesson.codigo}` });

  const links = [
    { label: "Resumen del curso", route: `course/${course.key}`, active: routeName === "course" },
    ...(unit ? [{ label: unit.titulo, route: `unit/${course.key}/${unit.codigo}`, active: routeName === "unit" }] : []),
    ...(lesson ? [{ label: lesson.titulo || "Lección", route: `lesson/${course.key}/${lesson.codigo}`, active: routeName === "lesson" }] : []),
    ...(unit ? [{ label: "Cuestionario · práctica", route: `quiz/${course.key}/${unit.codigo}`, active: routeName === "quiz" }] : []),
    ...(course.key === "MERCANCIAS_PELIGROSAS" ? [{ label: "Tarjetas demo", route: `flashcards/${course.key}/DEMO-MP`, active: routeName === "flashcards" }] : []),
    { label: "Evaluación final · demo", route: `exam/${course.key}`, active: routeName === "exam" }
  ];

  return `
    <div class="player-layout">
    <aside class="player-outline panel" aria-label="Contenido del curso">
      <strong>${escapeHtml(course.title)}</strong>
      <nav class="player-outline__links" aria-label="Navegación del curso">
        ${links.map((link) => `<a class="${link.active ? "is-active" : ""}" href="#/${escapeHtml(link.route)}" data-route="${escapeHtml(link.route)}"${link.active ? ' aria-current="page"' : ""}>${escapeHtml(link.label)}</a>`).join("")}
      </nav>
      <span class="helper-text">Contenido didáctico demo · requiere revisión editorial.</span>
    </aside>
    <div class="player-main">
    <nav class="player-breadcrumbs" aria-label="Ruta de aprendizaje">
      ${crumbs.map((crumb, index) => `
        ${index ? '<span aria-hidden="true">/</span>' : ""}
        <a href="#/${escapeHtml(crumb.route)}" data-route="${escapeHtml(crumb.route)}">${escapeHtml(crumb.label)}</a>`).join("")}
      <span aria-current="page">${escapeHtml(PLAYER_ROUTES[routeName] || "Reproductor")}</span>
    </nav>
    `;
}

export function closePlayerNavigation() {
  return "</div></div>";
}
