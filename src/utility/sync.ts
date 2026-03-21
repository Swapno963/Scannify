import { postScannedInfo } from './api';
import { dbPromise } from './db';

export async function syncScans() {
  const db = await dbPromise;
  const allScans = await db.getAll('scans');

  for (const scan of allScans) {
    if (!scan.synced) {
      try {
        await postScannedInfo(scan.value,
                            scan.barcode_type,
                            scan.timestamp, 
                            scan.device_info);

        // mark as synced
        scan.synced = true;
        await db.put('scans', scan);

      } catch (err) {
        console.log("Retry later:", scan.id);
      }
    }
  }
}