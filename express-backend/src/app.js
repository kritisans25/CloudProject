const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize express app
const app = express();

// Enable CORS for frontend (React)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Root route check
app.get("/", (req, res) => {
  return res.json({ message: "Express backend running ✅" });
});

// Import and use routes
const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patient", patientRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctor", doctorRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
