import { SavedPatient } from './types';

const DB_NAME = 'LevofloxacinCalcDB';
const STORE_NAME = 'patients';
const DB_VERSION = 1;

// Helper to open the database
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
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const PatientService = {
  // Get all patients sorted by date (newest first)
  getAll: async (): Promise<SavedPatient[]> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const results = request.result as SavedPatient[];
          // Sort by timestamp descending
          resolve(results.sort((a, b) => b.timestamp - a.timestamp));
        };
        request.onerror = () => reject('Error fetching patients');
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Add a new patient
  add: async (patient: SavedPatient): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(patient);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error saving patient');
    });
  },

  // Delete a patient by ID
  delete: async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error deleting patient');
    });
  }
};
