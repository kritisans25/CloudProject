import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import DoctorLogin from "./pages/DoctorLogin";
import PatientLogin from "./pages/PatientLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: Role Selection */}
        <Route path="/" element={<RoleSelection />} />

        {/* Doctor Routes */}
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        {/* Patient Routes */}
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
