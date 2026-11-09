import { getRecord, putRecord } from "./og-persistence-db.js";

const routePattern = /^(home|operations|academy|profile|course\/[A-Z0-9_]+|unit\/[A-Z0-9_]+\/[A-Z0-9-]+|lesson\/[A-Z0-9_]+\/[A-Z0-9-]+|activity\/[A-Z0-9_]+\/[A-Z0-9-]+|quiz\/[A-Z0-9_]+\/[A-Z0-9-]+|flashcards\/[A-Z0-9_]+\/[A-Z0-9-]+|exam\/[A-Z0-9_]+|results\/[A-Z0-9_]+\/[A-Za-z0-9-]+)$/;

export function isRestorableRoute(route) {
  return typeof route === "string" && routePattern.test(route);
}

export async function saveLastScreen(route) {
  if (!isRestorableRoute(route)) return;
  return putRecord("navigation", {
    id: "last-screen",
    route,
    updatedAt: new Date().toISOString()
  });
}

export async function getLastScreen() {
  const record = await getRecord("navigation", "last-screen");
  return isRestorableRoute(record?.route) ? record.route : null;
}
