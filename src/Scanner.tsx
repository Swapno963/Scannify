import { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

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
  const [isScanning, setIsScanning] = useState<boolean>(false);

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
    return navigator.userAgent;
  };
  const startScanner = async () => {
    if (!videoRef.current || isScanning) return;

    setError("");
    setResult("");

    try {
      initReader();

      const reader = readerRef.current!;
      setIsScanning(true);

      controlsRef.current = await reader.decodeFromVideoDevice(
        undefined, // can change to rear camera later
        videoRef.current,
        (res) => {
          if (res) {
            const text = res.getText();
             const scanData: ScanResult = {
                        value: res.getText(),
                        format: res.getBarcodeFormat().toString(),
                        timestamp: new Date().toISOString(),
                        device: getDeviceInfo(),
                      };
            console.log("The scanData is : ", scanData)
            setResult(text);

            // Stop after successful scan
            stopScanner();
          }
        }
      );
    } catch (err: unknown) {
      setIsScanning(false);
      if (err instanceof Error) {
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
    <div style={{ textAlign: "center" }}>
      <h2>QR & EAN-13 Scanner</h2>

      <video
        ref={videoRef}
        style={{ width: "100%", maxWidth: "400px" }}
        muted
      />

      <div style={{ marginTop: "10px" }}>
        {!isScanning ? (
          <button onClick={startScanner}>Start Scan</button>
        ) : (
          <button onClick={stopScanner}>Stop Scan</button>
        )}
      </div>

      <p>
        <strong>Result:</strong> {result || "No result yet"}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Scanner;