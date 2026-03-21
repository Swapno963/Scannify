import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { UAParser } from 'ua-parser-js';
import History from "./History";
import { saveScanOffline } from "../utility/scanService";
import { postScannedInfo } from "../utility/api";
import { syncScans } from "../utility/sync";
import '../index.css';


const Scanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  type ScanResult = {
    value: string;
    format: string;
    timestamp: string;
    device: string;
  };
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string>("");
  const [manualInput, setManualInput] = useState<string>("");
  const [refreshList, setRefreshList] = useState(false);
  useEffect(() => {
    function handleOnline() {
      console.log('Internet restored');
      // trigger sync
        syncScans();

    }

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);


  // Initialize reader once
  const initReader = () => {
    if (readerRef.current) return;

    const hints = new Map<DecodeHintType, unknown>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13
    ]);

    readerRef.current = new BrowserMultiFormatReader(hints);
  };
  const getDeviceInfo = (): string => {
    const parser = new UAParser();
    const result = parser.getResult();
    console.log("result.os", result.os);
    
  // You can customize what to return
  return `${result.os.name} ${result.os.version} - ${result.browser.name} ${result.browser.version}`;
  };
 
const startScanner = async () => {
  if (!videoRef.current || isScanning) return;

  setError("");
  setPermissionError("");
  setResult("");

  try {
    // First, request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // If permission granted, assign stream to video element
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    initReader();
    const reader = readerRef.current!;
    setIsScanning(true);

    controlsRef.current = await reader.decodeFromVideoDevice(
      undefined, // default camera
      videoRef.current,
      async (res) =>  {
        if (res) {
          const scanData: ScanResult = {
            value: res.getText(),
            format: res.getBarcodeFormat().toString(),
            timestamp: new Date().toISOString(),
            device: getDeviceInfo(),
          };
          const formattedResult = `
                                Scan Complete!

                                Here's what we found:

                                Code: ${scanData.value}

                                Type: ${scanData.format}
                                Scanned on: ${new Date(scanData.timestamp).toLocaleString()}
                                Device: ${scanData.device}
                                `;
          setResult(formattedResult);
          if (!navigator.onLine) {
              await saveScanOffline(
                                    res.getText(),
                                    res.getBarcodeFormat().toString(),
                                    new Date().toISOString(),
                                    getDeviceInfo()
                                    );
              alert("Saved offline, will sync later");
            } else {
              setError("");
              setSuccess("");
              const is_saved = await postScannedInfo(
                                                    res.getText(),
                                                    res.getBarcodeFormat().toString(),
                                                    new Date().toISOString(),
                                                    getDeviceInfo()
                                                  );
                                                    console.log("is_saved ", is_saved)
              if(is_saved){
                      setSuccess("Scanned Info saved successful!");
                      setRefreshList(prev => !prev);
              }
              else{
                      setError("Something went wrong!");

              }
            }
          stopScanner();
        }
      }
    );
  } catch (err: unknown) {
    setIsScanning(false);

    // Handle permission denial
    if (err instanceof DOMException && err.name === "NotAllowedError") {
      setPermissionError(
        "Camera access was denied. Please allow camera access to scan codes."
      );
    } else if (err instanceof Error) {
      setError("Camera error: " + err.message);
    } else {
      setError("Unknown error");
    }
  }
};

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <div
    className="flex w-full"
     style={{ textAlign: "center" }}>
      <div className="w-3/5 bg-blue-200 p-4">

      
      <h2>QR & EAN-13 Scanner</h2>

      <video
        ref={videoRef}
        style={{ width: "100%", maxWidth: "400px" }}
        muted
      />

      <div style={{ marginTop: "10px" }}>
        {!isScanning ? (
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={startScanner}>Start Scan</button>
        ) : (
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={stopScanner}>Stop Scan</button>
        )}
      </div>

      <p>
        <strong>Result:</strong> {result || "No result yet"}
        <strong>Status :</strong> {success || ""}
      </p>
      {permissionError && (
  <div style={{ marginTop: "10px" }}>
    <p style={{ color: "orange" }}>
      {permissionError} — or enter the code manually:
    </p>
    <input
      type="text"
      value={manualInput}
      onChange={(e) => setManualInput(e.target.value)}
      placeholder="Enter QR/EAN-13 code"
      style={{ padding: "5px", width: "250px" }}
    />
    <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
      style={{ marginLeft: "10px" }}
      onClick={() => {
        const scanData: ScanResult = {
          value: manualInput,
          format: "MANUAL",
          timestamp: new Date().toISOString(),
          device: getDeviceInfo(),
        };
        setResult(JSON.stringify(scanData, null, 2));
        setManualInput("");
      }}
    >
      Submit
    </button>
  </div>
)}
</div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* {permissionError && (
  <p style={{ color: "orange" }}>{permissionError}</p>
)} */}
<div className="w-2/5 bg-blue-200 p-4">
<History refreshList={refreshList}></History>
</div>
    </div>
  );
};

export default Scanner;