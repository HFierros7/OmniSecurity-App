import { getAllRecords } from "./db.js";

export async function listEvidencesForIncident(incidentId) {
  const records = await getAllRecords("evidences");
  return records.filter((record) => record.incidentId === incidentId);
}
