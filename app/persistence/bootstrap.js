import { saveDemoUser } from "./users.js";
import { listLogbookEntries } from "./logbook.js";
import { listIncidents } from "./incidents.js";
import { listSosHistory } from "./sos.js";
import { listCourseProgress } from "./progress.js";
import { listEvaluationStates } from "./evaluations.js";
import { getCurrentCourse } from "./courses.js";
import { getLastScreen } from "./navigation.js";
import { listLearningState } from "./learning.js";

export async function hydratePersistentState(state) {
  await saveDemoUser(state.data.user);
  const [logbook, incidents, sosHistory, progress, evaluations, currentCourse, lastScreen, learning] = await Promise.all([
    listLogbookEntries(),
    listIncidents(),
    listSosHistory(),
    listCourseProgress(),
    listEvaluationStates(),
    getCurrentCourse(),
    getLastScreen(),
    listLearningState()
  ]);

  state.incidents = incidents;
  state.sosHistory = sosHistory;
  state.progressByCourse = Object.fromEntries(progress.map((record) => [record.courseKey, record]));
  if (state.progressByCourse.AVSEC?.contentVersion !== state.data.avsecCourse.content_version) {
    delete state.progressByCourse.AVSEC;
  }
  state.evaluationsByCourse = Object.fromEntries(evaluations.map((record) => [record.courseKey, record]));
  state.activitiesById = Object.fromEntries(learning.activities.map((record) => [record.id, record]));
  state.flashcardsByCourse = Object.fromEntries(learning.flashcards.map((record) => [record.courseKey, record]));
  state.quizzesById = Object.fromEntries(learning.quizzes.map((record) => [record.id, record]));
  state.examAttemptsByCourse = Object.fromEntries(learning.examAttempts.map((record) => [record.courseKey, record]));
  state.examResultsById = Object.fromEntries(learning.examResults.map((record) => [record.id, record]));
  const studyStats = learning.learningStats.find((record) => record.id === "summary");
  state.studySeconds = Number(studyStats?.studySeconds) || 0;
  state.lastLearningActivity = studyStats?.lastActivityAt || null;
  state.data.courses = state.data.courses.map((course) => {
    const saved = state.progressByCourse[course.key];
    return saved ? { ...course, progress: saved.percentComplete } : course;
  });
  state.currentCourse = currentCourse;
  state.lastScreen = lastScreen;

  const resumeProgress = Object.values(state.progressByCourse)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
  state.resumeCourseKey = currentCourse?.courseKey
    || resumeProgress?.courseKey
    || state.data.courses.find((course) => course.progress > 0)?.key
    || state.data.courses[0]?.key;

  const newestTurn = logbook
    .filter((record) => record.entityType === "TURNO")
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))[0];
  state.checkedIn = newestTurn?.action === "CHECK_IN";
  state.checkedOut = newestTurn?.action === "CHECK_OUT";

  const savedEvents = logbook
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
    .map((record) => ({
      id: record.id,
      category: record.entityType,
      title: record.title,
      detail: record.detail,
      time: `${record.localDate} · ${record.localTime}`,
      status: "Guardado en este dispositivo",
      evidenceCount: record.evidenceIds?.length || 0,
      occurredAt: record.occurredAt
    }));
  state.events = [...savedEvents, ...state.data.timeline];
}
