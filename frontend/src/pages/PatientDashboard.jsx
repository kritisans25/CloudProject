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
import { io } from "socket.io-client";

// Connect socket
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const socket = io(API_BASE, {
  transports: ["websocket"], // ensures stable connection
});


function PatientDashboard() {
  const [vitals, setVitals] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // 👇 Each patient mapped to doctor
  const doctorMap = {
    patient01: "doctor@test.com",
    patient02: "doctor@test.com",
    patient03: "doctor2@test.com",
  };

  const patientId = localStorage.getItem("patientId") || "patient01";
  const assignedDoctor = doctorMap[patientId];

  // 🔁 Send mock vitals every 5 seconds
  useEffect(() => {
    const simulateVitals = setInterval(() => {
      const newVitals = {
        patientId,
        heartRate: Math.floor(Math.random() * 40) + 70,
        bp_sys: Math.floor(Math.random() * 20) + 110,
        bp_dia: Math.floor(Math.random() * 10) + 65,
        oxygenLevel: Math.floor(Math.random() * 5) + 95,
        sugar: Math.floor(Math.random() * 50) + 90,
        temperature: (97 + Math.random()).toFixed(1),
        timestamp: new Date().toISOString(),
      };

      setVitals(newVitals);
      setHistory((prev) => [...prev.slice(-19), newVitals]);

      // 🧠 Send data to doctor in real time
      socket.emit("vitalsUpdate", newVitals);
      console.log(`📤 Sent vitals from ${patientId} → ${assignedDoctor}`);
    }, 5000);

    return () => clearInterval(simulateVitals);
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!vitals) return <div className="centered">Loading vitals...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Patient Dashboard ❤️</h1>
      <p className="dashboard-subtitle">
        Connected to: {assignedDoctor}
      </p>

      <div className="patient-card green">
        <h2>{vitals.patientId}</h2>
        <div className="vitals">
          <p>❤️ <b>Heart Rate:</b> {vitals.heartRate} bpm</p>
          <p>🩸 <b>Blood Pressure:</b> {vitals.bp_sys}/{vitals.bp_dia}</p>
          <p>🌬️ <b>Oxygen Level:</b> {vitals.oxygenLevel}%</p>
          <p>🍬 <b>Sugar:</b> {vitals.sugar} mg/dL</p>
          <p>🌡️ <b>Temperature:</b> {vitals.temperature} °F</p>
          <p className="timestamp">
            ⏱️ {new Date(vitals.timestamp).toLocaleTimeString()}
          </p>
        </div>

        {/* Mini Chart */}
        <div className="chart">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[50, 130]} hide />
              <Tooltip
                labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#ff7b47"
                strokeWidth={3}
                dot={{ r: 3, stroke: "#ffb547", strokeWidth: 1, fill: "#ff7b47" }}
                activeDot={{ r: 5, fill: "#ff9447" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
