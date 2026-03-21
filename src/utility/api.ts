import { saveScanOffline } from "./scanService";

 const API_URL = import.meta.env.VITE_API_URL;

 export async function  postScannedInfo(value:string,barcode_type:string,timestamp:String, device_info:string){


    try {
      const res = await fetch(`${API_URL}/api/scaning_info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           "user_id":localStorage.getItem('userId'),
          "value":value, 
          "barcode_type":barcode_type,
          "timestamp":timestamp,
          "device_info":device_info
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Scanned Info failed to save.");
      }


      return true
    } catch (err: any) {
      await saveScanOffline(
                            value,
                            barcode_type,
                            timestamp, 
                            device_info,
                            );
      return false
    }
  };