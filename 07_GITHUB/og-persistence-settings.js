import { getRecord, putRecord } from "./og-persistence-db.js";

export async function getSetting(key) {
  const record = await getRecord("settings", key);
  return record?.value ?? null;
}

export function saveSetting(key, value) {
  return putRecord("settings", {
    id: key,
    value,
    updatedAt: new Date().toISOString()
  });
}
