  import { dbPromise } from './db';
import { v4 as uuidv4 } from 'uuid';

export async function saveScanOffline(value:string,barcode_type:string,timestamp:String, device_info:string) {
  const db = await dbPromise;
  await db.put('scans', {
      value,
      barcode_type,
      timestamp, 
      device_info,
      id: uuidv4(),
      synced: false,
    createdAt: new Date().toISOString(),
  });
}