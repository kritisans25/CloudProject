import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";
import { io } from "socket.io-client";
import axios from "axios";
import VitalsCard from "../components/VitalsCard"; // ✅ Reusable card

const socket = io("http://localhost:5000", { transports: ["websocket"] });

function DoctorDashboard() {
  const [vitals, setVitals] = useState([]);
  const [history, setHistory] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const doctorEmail = localStorage.getItem("doctorEmail") || "doctor@test.com";

  // ✅ Fetch from DynamoDB (only latest per patient)
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/doctor/vitals/${doctorEmail}`
        );
        const data = res.data.items || [];

        // ✅ Keep only the latest record per patientId
        const latestVitals = Object.values(
          data.reduce((acc, item) => {
            const pid = item.patientId;
            if (!acc[pid] || Number(item.timestamp) > Number(acc[pid].timestamp)) {
              acc[pid] = item;
            }
            return acc;
          }, {})
        );

        setVitals(latestVitals);

        // ✅ Prepare historical chart data
        const grouped = data.reduce((acc, item) => {
          if (!acc[item.patientId]) acc[item.patientId] = [];
          acc[item.patientId].push(item);
          return acc;
        }, {});
        setHistory(grouped);
      } catch (err) {
        console.error("❌ Error fetching vitals:", err);
        setError("Failed to fetch patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, [doctorEmail]);

  // ✅ Real-time updates via WebSocket
  useEffect(() => {
    socket.emit("doctorJoin", doctorEmail);
    console.log(`🧠 Doctor joined private room: ${doctorEmail}`);

    socket.on("vitalsUpdate", (data) => {
      console.log("📡 Live vitals received:", data);

      // Update latest vitals table
      setVitals((prev) => {
        const exists = prev.find((p) => p.patientId === data.patientId);
        if (exists) {
          return prev.map((p) =>
            p.patientId === data.patientId ? data : p
          );
        } else {
          return [...prev, data];
        }
      });

      // Update chart history
      setHistory((prev) => {
        const updated = { ...prev };
        if (!updated[data.patientId]) updated[data.patientId] = [];
        updated[data.patientId] = [...updated[data.patientId], data].slice(-20);
        return updated;
      });
    });

    return () => {
      socket.off("vitalsUpdate");
      console.log("🧹 Doctor socket listener cleaned up");
    };
  }, [doctorEmail]);

  if (loading) return <div className="centered">Loading vitals...</div>;
  if (error) return <div className="error">⚠ {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Doctor Dashboard 🩺</h1>
        <p className="dashboard-subtitle">Live + Historical Patient Monitoring</p>
      </div>

      <div className="patient-grid">
        {vitals.length === 0 ? (
          <p className="centered">No patient data yet...</p>
        ) : (
          vitals.map((v) => (
            <VitalsCard
              key={v.patientId}
              vitals={v}
              history={history[v.patientId] || []}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
