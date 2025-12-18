import { SavedPatient, SideEffectReport } from './types';

const DB_NAME = 'LevoCalcDB';
const PATIENTS_STORE = 'patients';
const EFFECTS_STORE = 'sideEffects';
const DB_VERSION = 2;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject('IndexedDB not supported');
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Error opening database');

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PATIENTS_STORE)) {
        db.createObjectStore(PATIENTS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(EFFECTS_STORE)) {
        db.createObjectStore(EFFECTS_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const PatientService = {
  getAll: async (): Promise<SavedPatient[]> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(PATIENTS_STORE, 'readonly');
        const store = transaction.objectStore(PATIENTS_STORE);
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result as SavedPatient[];
          resolve(results.sort((a, b) => b.timestamp - a.timestamp));
        };
        request.onerror = () => reject('Error fetching patients');
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  add: async (patient: SavedPatient): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PATIENTS_STORE, 'readwrite');
      const store = transaction.objectStore(PATIENTS_STORE);
      const request = store.add(patient);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error saving patient');
    });
  },

  delete: async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PATIENTS_STORE, 'readwrite');
      const store = transaction.objectStore(PATIENTS_STORE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error deleting patient');
    });
  }
};

export const EffectService = {
  getAll: async (): Promise<SideEffectReport[]> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(EFFECTS_STORE, 'readonly');
        const store = transaction.objectStore(EFFECTS_STORE);
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result as SideEffectReport[];
          resolve(results.sort((a, b) => b.timestamp - a.timestamp));
        };
        request.onerror = () => reject('Error fetching side effects');
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  add: async (text: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(EFFECTS_STORE, 'readwrite');
      const store = transaction.objectStore(EFFECTS_STORE);
      const report: SideEffectReport = {
        id: Date.now().toString(),
        text,
        timestamp: Date.now()
      };
      const request = store.add(report);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error saving side effect');
    });
  }
};
