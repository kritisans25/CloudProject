import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function VitalsCard({ vitals, history }) {
  const getStatus = (v) => {
    if (!v) return "";
    if (v.heartRate < 60 || v.heartRate > 110 || v.oxygenLevel < 94) return "red";
    if (v.heartRate > 90 || v.sugar > 130) return "yellow";
    return "green";
  };

  const colorClass = getStatus(vitals);

  return (
    <div className={`patient-card ${colorClass}`}>
      <h2>{vitals.patientId}</h2>
      <div className="vitals">
        <p>❤️ <b>Heart Rate:</b> {vitals.heartRate} bpm</p>
        <p>🩸 <b>Blood Pressure:</b> {vitals.bp_sys}/{vitals.bp_dia}</p>
        <p>🌬️ <b>Oxygen Level:</b> {vitals.oxygenLevel}%</p>
        <p>🍬 <b>Sugar:</b> {vitals.sugar} mg/dL</p>
        <p>🌡️ <b>Temperature:</b> {vitals.temperature} °F</p>
        <p className="timestamp">
          ⏱️ {new Date(Number(vitals.timestamp)).toLocaleTimeString()}
        </p>
      </div>

      {/* Chart for this patient */}
      <div className="chart">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="timestamp" hide />
            <YAxis domain={[50, 130]} hide />
            <Tooltip
              labelFormatter={(t) => new Date(Number(t)).toLocaleTimeString()}
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
}

export default VitalsCard;
