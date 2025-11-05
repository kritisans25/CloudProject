import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-container">
      <div className="role-box">
        <h1 className="role-title">Welcome to Cloud Health 🌤️</h1>
        <p className="role-subtitle">Select your role to continue</p>

        <div className="role-buttons">
          <button className="role-btn doctor" onClick={() => navigate("/doctor-login")}>
            🩺 Doctor Login
          </button>
          <button className="role-btn patient" onClick={() => navigate("/patient-login")}>
            ❤️ Patient Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
