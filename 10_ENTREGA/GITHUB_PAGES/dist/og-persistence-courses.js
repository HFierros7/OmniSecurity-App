import { getRecord, putRecord } from "./og-persistence-db.js";

export function saveCurrentCourse(course) {
  return putRecord("courses", {
    id: "current",
    ...course,
    updatedAt: new Date().toISOString()
  });
}

export function getCurrentCourse() {
  return getRecord("courses", "current");
}
