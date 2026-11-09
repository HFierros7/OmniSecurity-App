const RESUMABLE_SCREENS = new Set(["course", "unit", "lesson", "activity", "quiz", "flashcards", "exam", "results"]);

export function getResumeTarget(data, state) {
  const course = data.courses.find((item) => item.key === state.resumeCourseKey) || data.courses[0];
  if (!course) return null;
  const progress = state.progressByCourse[course.key];
  const unitCode = progress?.unitCode || state.currentCourse?.unitCode || course.unitCode;
  const lessonCode = progress?.lessonCode || state.currentCourse?.lessonCode || course.lessonCode;
  const unit = data.units.find((item) => item.codigo === unitCode);
  const lesson = data.lessons.find((item) => item.codigo === lessonCode);
  const progressRoute = lessonCode
    ? `lesson/${course.key}/${lessonCode}`
    : unitCode
      ? `unit/${course.key}/${unitCode}`
      : `course/${course.key}`;
  const savedRoute = state.lastScreen?.split("/") || [];
  const route = RESUMABLE_SCREENS.has(savedRoute[0]) && savedRoute[1] === course.key
    ? state.lastScreen
    : progressRoute;
  const activityDate = progress?.lastActivity ? Date.parse(progress.lastActivity) : NaN;
  const formattedDate = Number.isFinite(activityDate)
    ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(activityDate)
    : null;
  const lastActivity = [progress?.lastActivityLabel, formattedDate].filter(Boolean).join(" · ")
    || "Actividad demo inicial";

  return {
    course,
    unitTitle: unit?.titulo || course.unitTitle,
    lessonTitle: lesson?.titulo || course.lessonTitle || "Lección pendiente",
    percentComplete: progress?.percentComplete ?? course.progress,
    lastActivity,
    route
  };
}
