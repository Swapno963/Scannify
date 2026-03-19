import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
const API_URL = import.meta.env.VITE_API_URL;

interface ScanInfo {
  id: number;
  user_id: number;
  value: string;
  barcode_type: string;
  timestamp: string;
  device_info: string;
  created_at: string;
}

const History: React.FC = () => {
  const [scanData, setScanData] = useState<ScanInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");



const exportCSV = (scanData: ScanInfo[]) => {
  if (scanData.length === 0) return;

  const headers = ["Value", "Barcode Type", "Timestamp", "Device Info"];
  const rows = scanData.map(scan => [
    scan.value,
    scan.barcode_type,
    new Date(scan.timestamp).toLocaleString(),
    scan.device_info
  ]);

  const csvContent =
    [headers, ...rows]
      .map(e => e.map(v => `"${v}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "scan_history.csv");
};


const exportPDF = (scanData: ScanInfo[]) => {
  if (scanData.length === 0) return;

  const doc = new jsPDF();
  const tableColumn = ["Value", "Barcode Type", "Timestamp", "Device Info"];
  const tableRows = scanData.map(scan => [
    scan.value,
    scan.barcode_type,
    new Date(scan.timestamp).toLocaleString(),
    scan.device_info
  ]);

  doc.autoTable({
    headers: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.text("Scan History", 14, 15);
  doc.save("scan_history.pdf");
};
  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/scaning_info/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch scan history");
        }
        const data = await res.json();
        setScanData(data.scan_info || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Loading scan history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Scan History</h2>
      <div className="flex gap-2 mb-4">
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => exportCSV(scanData)}
  >
    Export CSV
  </button>
  <button
    className="bg-green-500 text-white px-4 py-2 rounded"
    onClick={() => exportPDF(scanData)}
  >
    Export PDF
  </button>
</div>
      {scanData.length === 0 ? (
        <p>No scans found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Barcode Type</th>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Device Info</th>
            </tr>
          </thead>
          <tbody>
            {scanData.map((scan) => (
              <tr key={scan.id} className="even:bg-gray-50">
                <td className="p-2 border">{scan.value}</td>
                <td className="p-2 border">{scan.barcode_type}</td>
                <td className="p-2 border">
                  {new Date(scan.timestamp).toLocaleString()}
                </td>
                <td className="p-2 border">{scan.device_info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;