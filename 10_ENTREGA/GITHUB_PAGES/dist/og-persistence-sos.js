import { getAllRecords, putRecords } from "./og-persistence-db.js";
import { createLocalId } from "./og-persistence-ids.js";

export async function saveSosSimulation(record, logbookEntry) {
  const sosRecord = {
    ...record,
    id: createLocalId(),
    occurredAt: new Date().toISOString(),
    status: "SIMULADO"
  };
  const logRecord = {
    ...logbookEntry,
    id: createLocalId(),
    entityType: "SOS",
    entityId: sosRecord.id,
    occurredAt: sosRecord.occurredAt,
    status: "LOCAL"
  };
  await putRecords([
    { store: "sosHistory", record: sosRecord },
    { store: "logbook", record: logRecord }
  ]);
  return { sos: sosRecord, logbook: logRecord };
}

export function listSosHistory() {
  return getAllRecords("sosHistory");
}
