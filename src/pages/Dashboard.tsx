import { useEffect, useState } from "react";

type ScanPerDay = {
  scan_date: string;
  total_scans: number;
};

type TopCode = {
  value: string;
  scan_count: number;
};

type DashboardData = {
  scansPerDay: ScanPerDay[];
  topCodes: TopCode[];
};

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = getToken();

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* Scans Per Day */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Scans Per Day</h2>

        {data?.scansPerDay.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div className="space-y-2">
            {data?.scansPerDay.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b pb-1 text-sm"
              >
                <span>
                  {new Date(item.scan_date).toLocaleDateString()}
                </span>
                <span className="font-medium">
                  {item.total_scans} scans
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Codes */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Top Scanned Codes</h2>

        {data?.topCodes.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div className="space-y-2">
            {data?.topCodes.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b pb-1 text-sm"
              >
                <span className="truncate max-w-[70%]">
                  {item.value}
                </span>
                <span className="font-medium">
                  {item.scan_count} times
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;