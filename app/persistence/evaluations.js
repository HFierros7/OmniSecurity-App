import { getAllRecords, putRecord } from "./db.js";

export function saveEvaluationState(courseKey, attempt) {
  return putRecord("evaluations", {
    ...attempt,
    id: `demo:${courseKey}`,
    courseKey,
    updatedAt: new Date().toISOString()
  });
}

export function listEvaluationStates() {
  return getAllRecords("evaluations");
}
