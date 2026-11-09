import { getAllRecords, putRecord } from "./db.js";
import { createLocalId } from "./ids.js";

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
