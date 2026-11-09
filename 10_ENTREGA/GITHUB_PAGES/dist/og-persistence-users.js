import { getRecord, putRecord } from "./og-persistence-db.js";

export function saveDemoUser(user) {
  return putRecord("users", {
    id: user.employeeId,
    name: user.name,
    employeeId: user.employeeId,
    group: user.group,
    savedAt: new Date().toISOString()
  });
}

export function getDemoUser(employeeId) {
  return getRecord("users", employeeId);
}
