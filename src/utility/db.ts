import { openDB } from 'idb';

export const dbPromise = openDB('scan-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('scans')) {
      db.createObjectStore('scans', { keyPath: 'id' });
    }
  },
});