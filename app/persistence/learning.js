import { getAllRecords, getRecord, putRecord, putRecords } from "./db.js";

const LEARNING_STORES = [
  "activities",
  "flashcards",
  "quizzes",
  "examAttempts",
  "examResults",
  "learningStats"
];

export async function listLearningState() {
  const records = await Promise.all(LEARNING_STORES.map((store) => getAllRecords(store)));
  return Object.fromEntries(LEARNING_STORES.map((store, index) => [store, records[index]]));
}

export function getLearningRecord(store, id) {
  if (!LEARNING_STORES.includes(store)) {
    return Promise.reject(new Error(`Almacén LMS no reconocido: ${store}`));
  }
  return getRecord(store, id);
}

export function saveLearningRecord(store, record) {
  if (!LEARNING_STORES.includes(store)) {
    return Promise.reject(new Error(`Almacén LMS no reconocido: ${store}`));
  }
  return putRecord(store, record);
}

export function saveLearningRecords(entries) {
  if (entries.some(({ store }) => !LEARNING_STORES.includes(store))) {
    return Promise.reject(new Error("La transacción contiene un almacén LMS no reconocido."));
  }
  return putRecords(entries);
}
