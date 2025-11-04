const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// ✅ Doctor login route
router.post("/login", doctorController.doctorLogin);

// ✅ Generate mock vitals for 4 patients (temporary)
router.get("/vitals", authenticateUser, authorizeRole("doctor"), async (req, res) => {
  try {
    const patients = ["patient01", "patient02", "patient03", "patient04"];
    const vitals = patients.map((id) => ({
      patientId: id,
      heartRate: Math.floor(60 + Math.random() * 50),
      bp_sys: Math.floor(100 + Math.random() * 30),
      bp_dia: Math.floor(60 + Math.random() * 20),
      oxygenLevel: Math.floor(92 + Math.random() * 8),
      sugar: Math.floor(80 + Math.random() * 60),
      temperature: (97 + Math.random() * 2).toFixed(1),
      timestamp: Date.now(),
    }));
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vitals" });
  }
});


module.exports = router;
