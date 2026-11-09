import { getAllRecords, putRecord } from "./db.js";

export async function saveCourseProgress(progress) {
  const record = {
    ...progress,
    id: progress.courseKey,
    updatedAt: new Date().toISOString()
  };
  await putRecord("progress", record);
  return record;
}

export function listCourseProgress() {
  return getAllRecords("progress");
}
