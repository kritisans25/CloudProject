const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// 🧠 Dummy patient data (can connect to DB later)
const patients = [
  { id: "patient01", email: "patient1@mail.com", password: "pass123", role: "patient" },
  { id: "patient02", email: "patient2@mail.com", password: "pass123", role: "patient" },
];

// ✅ 1️⃣ Patient Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find matching patient
    const patient = patients.find(
      (p) => p.email === email && p.password === password
    );

    if (!patient) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: patient.id, email: patient.email, role: patient.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      patientId: patient.id,
    });
  } catch (error) {
    console.error("Error in patient login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ 2️⃣ Fetch Patient’s Live Vitals (protected route)
router.get("/vitals", authenticateUser, authorizeRole("patient"), async (req, res) => {
  try {
    const patientId = req.user.id || "patient01"; // Get from JWT

    const vitals = {
      patientId,
      heartRate: Math.floor(60 + Math.random() * 60),
      bp_sys: Math.floor(100 + Math.random() * 30),
      bp_dia: Math.floor(60 + Math.random() * 20),
      oxygenLevel: Math.floor(90 + Math.random() * 10),
      sugar: Math.floor(80 + Math.random() * 60),
      temperature: (97 + Math.random() * 2).toFixed(1),
      timestamp: Date.now(),
    };

    res.json(vitals);
  } catch (error) {
    console.error("Error generating patient vitals:", error);
    res.status(500).json({ message: "Error fetching vitals" });
  }
});

module.exports = router;
