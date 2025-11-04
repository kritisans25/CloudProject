import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientLogin from "./pages/PatientLogin";
import PatientDashboard from "./pages/PatientDashboard"; // (we’ll make this next)




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DoctorLogin />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
