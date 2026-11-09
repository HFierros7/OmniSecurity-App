const DATABASE_NAME = "omniguard-local-demo";
const DATABASE_VERSION = 2;
const STORE_NAMES = [
  "users",
  "settings",
  "logbook",
  "incidents",
  "evidences",
  "courses",
  "progress",
  "evaluations",
  "navigation",
  "sosHistory",
  "activities",
  "flashcards",
  "quizzes",
  "examAttempts",
  "examResults",
  "learningStats"
];

let databasePromise;

export function openDatabase() {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("IndexedDB no está disponible en este navegador."));
  }
  if (databasePromise) return databasePromise;

  const opening = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    let settled = false;

    request.onupgradeneeded = () => {
      const database = request.result;
      STORE_NAMES.forEach((name) => {
        if (!database.objectStoreNames.contains(name)) {
          database.createObjectStore(name, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = () => {
      const database = request.result;
      if (settled) {
        database.close();
        return;
      }
      settled = true;
      database.onversionchange = () => {
        database.close();
        databasePromise = undefined;
      };
      resolve(database);
    };

    request.onerror = () => {
      if (settled) return;
      settled = true;
      reject(request.error || new Error("No se pudo abrir la base local IndexedDB."));
    };

    request.onblocked = () => {
      if (settled) return;
      settled = true;
      reject(new Error("IndexedDB está bloqueada por otra pestaña de OmniGuard."));
    };
  });

  databasePromise = opening.catch((error) => {
    databasePromise = undefined;
    throw error;
  });
  return databasePromise;
}

function requestTransaction(storeName, mode, createRequest) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const request = createRequest(transaction.objectStore(storeName));
    let result;

    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => {
      reject(request.error || new Error("Falló una operación IndexedDB."));
    };
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => {
      reject(transaction.error || new Error("Falló la transacción IndexedDB."));
    };
    transaction.onabort = () => {
      reject(transaction.error || new Error("La transacción IndexedDB fue cancelada."));
    };
  }));
}

export function getRecord(storeName, id) {
  return requestTransaction(storeName, "readonly", (store) => store.get(id));
}

export function getAllRecords(storeName) {
  return requestTransaction(storeName, "readonly", (store) => store.getAll());
}

export function putRecord(storeName, record) {
  if (!record?.id) return Promise.reject(new Error(`El registro de ${storeName} requiere una clave local.`));
  return requestTransaction(storeName, "readwrite", (store) => store.put(record));
}

export function putRecords(entries) {
  if (!entries.length) return Promise.resolve();
  const storeNames = [...new Set(entries.map((entry) => entry.store))];
  if (entries.some((entry) => !entry.record?.id)) {
    return Promise.reject(new Error("Cada registro de la transacción requiere una clave local."));
  }

  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(storeNames, "readwrite");
    entries.forEach(({ store, record }) => transaction.objectStore(store).put(record));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      reject(transaction.error || new Error("No se pudo guardar el conjunto de registros local."));
    };
    transaction.onabort = () => {
      reject(transaction.error || new Error("Se canceló el guardado local."));
    };
  }));
}
