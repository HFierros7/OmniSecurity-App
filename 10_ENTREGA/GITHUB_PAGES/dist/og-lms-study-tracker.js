import { saveLearningRecord } from "./og-persistence-learning.js";

const STUDY_ROUTE = /^(course|unit|lesson|activity|quiz|flashcards|exam|results)\//;

export function createStudyTracker(state, onError) {
  let active = false;
  let lastTick = Date.now();
  let route = "";
  let writeChain = Promise.resolve();

  async function flush(countVisibleElapsed = false) {
    const now = Date.now();
    const elapsed = active && (document.visibilityState === "visible" || countVisibleElapsed)
      ? Math.max(0, now - lastTick) / 1000
      : 0;
    lastTick = now;
    if (!elapsed) return;

    state.studySeconds += elapsed;
    state.lastLearningActivity = new Date(now).toISOString();
    writeChain = writeChain.catch(() => {}).then(() => saveLearningRecord("learningStats", {
      id: "summary",
      studySeconds: state.studySeconds,
      lastActivityAt: state.lastLearningActivity
    }));
    try {
      await writeChain;
    } catch (error) {
      onError(error);
    }
  }

  function update() {
    const nextRoute = window.location.hash.replace(/^#\/?/, "");
    const nextActive = Boolean(state.demoEntered && STUDY_ROUTE.test(nextRoute));
    if (nextRoute !== route || nextActive !== active) {
      void flush();
      route = nextRoute;
      active = nextActive;
      lastTick = Date.now();
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush(true);
    lastTick = Date.now();
  });
  window.setInterval(() => void flush(), 15000);

  return update;
}
