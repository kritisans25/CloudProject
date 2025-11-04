import React, { useEffect, useState } from "react";
import "./PatientDashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function PatientDashboard() {
  const [vitals, setVitals] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const fetchVitals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/patient/vitals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch vitals");

      setVitals(data);
      setHistory((prev) => [...prev.slice(-9), data]); // last 10 readings
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="error">⚠ {error}</div>;
  if (!vitals) return <div className="centered">Loading your vitals...</div>;

  return (
    <div className="patient-dashboard">
      <h1 className="title">Welcome, {vitals.patientId} 🧑‍⚕️</h1>
      <p className="subtitle">Your Real-Time Health Status</p>

      <div className="vitals-card">
        <p>❤️ <b>Heart Rate:</b> {vitals.heartRate} bpm</p>
        <p>🩸 <b>Blood Pressure:</b> {vitals.bp_sys}/{vitals.bp_dia}</p>
        <p>🌬️ <b>Oxygen Level:</b> {vitals.oxygenLevel}%</p>
        <p>🍬 <b>Sugar:</b> {vitals.sugar} mg/dL</p>
        <p>🌡️ <b>Temperature:</b> {vitals.temperature} °F</p>
        <p className="timestamp">⏱️ {new Date(vitals.timestamp).toLocaleTimeString()}</p>
      </div>

      {/* Heart Rate Trend Chart */}
      <div className="chart">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="timestamp" hide />
            <YAxis domain={[50, 130]} />
            <Tooltip labelFormatter={(t) => new Date(t).toLocaleTimeString()} />
            <Line type="monotone" dataKey="heartRate" stroke="#00c6ff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PatientDashboard;
