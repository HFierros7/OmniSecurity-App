import { getAllRecords, putRecords } from "./og-persistence-db.js";
import { createLocalId } from "./og-persistence-ids.js";

export async function saveIncidentBundle(incident, evidences, logbookEntry) {
  const incidentRecord = {
    ...incident,
    id: createLocalId(),
    occurredAt: incident.occurredAt || new Date().toISOString(),
    status: "LOCAL"
  };
  const evidenceRecords = evidences.map((evidence) => ({
    ...evidence,
    id: createLocalId(),
    incidentId: incidentRecord.id,
    capturedAt: incidentRecord.occurredAt,
    status: "LOCAL"
  }));
  const logbookRecord = {
    ...logbookEntry,
    id: createLocalId(),
    entityType: "INCIDENTE",
    entityId: incidentRecord.id,
    evidenceIds: evidenceRecords.map((record) => record.id),
    occurredAt: incidentRecord.occurredAt,
    status: "LOCAL"
  };

  await putRecords([
    { store: "incidents", record: incidentRecord },
    ...evidenceRecords.map((record) => ({ store: "evidences", record })),
    { store: "logbook", record: logbookRecord }
  ]);
  return { incident: incidentRecord, evidences: evidenceRecords, logbook: logbookRecord };
}

export function listIncidents() {
  return getAllRecords("incidents");
}
