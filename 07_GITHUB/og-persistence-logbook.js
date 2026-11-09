import { getAllRecords, putRecord } from "./og-persistence-db.js";
import { createLocalId } from "./og-persistence-ids.js";

export async function createLogbookEntry(entry) {
  const record = {
    ...entry,
    id: createLocalId(),
    occurredAt: entry.occurredAt || new Date().toISOString()
  };
  await putRecord("logbook", record);
  return record;
}

export function listLogbookEntries() {
  return getAllRecords("logbook");
}
