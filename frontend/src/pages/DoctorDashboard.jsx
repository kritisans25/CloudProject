import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function DoctorDashboard() {
  const [vitals, setVitals] = useState([]);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch from backend API (real-time)
  const fetchVitals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // JWT from login
      const res = await fetch("http://localhost:5000/api/doctor/vitals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch vitals");

      // ✅ Normalize patient IDs
      const normalized = data.map((p) => ({
        ...p,
        patientId: p.patientId || p.patientid || "Unknown",
      }));

      // ✅ Store history for mini chart (last 15 readings)
      const updatedHistory = { ...history };
      normalized.forEach((p) => {
        if (!updatedHistory[p.patientId]) updatedHistory[p.patientId] = [];
        updatedHistory[p.patientId] = [...updatedHistory[p.patientId], p].slice(-15);
      });

      setVitals(normalized);
      setHistory(updatedHistory);
      setError("");
    } catch (err) {
      console.error("❌ Error fetching vitals:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (v) => {
    if (v.heartRate < 60 || v.heartRate > 110 || v.oxygenLevel < 94) return "red";
    if (v.heartRate > 90 || v.sugar > 130) return "yellow";
    return "green";
  };

  if (loading) return <div className="centered">Loading vitals...</div>;
  if (error) return <div className="error">⚠ {error}</div>;

  return (
    <div className="dashboard-container">
      {/* Sticky Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Doctor Dashboard 🩺</h1>
        <p className="dashboard-subtitle">
          Live Monitoring – Latest Patient Vitals
        </p>
      </div>

      {/* Patient Cards */}
      <div className="patient-grid">
        {vitals.map((v) => {
          const colorClass = getStatus(v);
          return (
            <div key={v.patientId} className={`patient-card ${colorClass}`}>
              <h2>{v.patientId}</h2>

              <div className="vitals">
                <p>❤️ <b>Heart Rate:</b> {v.heartRate} bpm</p>
                <p>🩸 <b>Blood Pressure:</b> {v.bp_sys}/{v.bp_dia}</p>
                <p>🌬️ <b>Oxygen Level:</b> {v.oxygenLevel}%</p>
                <p>🍬 <b>Sugar:</b> {v.sugar} mg/dL</p>
                <p>🌡️ <b>Temperature:</b> {v.temperature} °F</p>
                <p className="timestamp">
                  ⏱️ {new Date(v.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {/* Heart Rate Mini Trend */}
              <div className="chart">
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={history[v.patientId] || []}>
                    <defs>
                      <linearGradient
                        id={`color-${v.patientId}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#ff7b47" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#ffb547" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis dataKey="timestamp" hide />
                    <YAxis domain={[50, 130]} hide />
                    <Tooltip
                      labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke={`url(#color-${v.patientId})`}
                      strokeWidth={3}
                      dot={{
                        r: 3,
                        stroke: "#ffb547",
                        strokeWidth: 1,
                        fill: "#ff7b47",
                      }}
                      activeDot={{ r: 5, fill: "#ff9447" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DoctorDashboard;

