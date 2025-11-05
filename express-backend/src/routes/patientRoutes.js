const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const users = require("../data/users");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const patient = users.patients[email];
  if (!patient || patient.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "patient", email: patient.email, patientId: patient.patientId },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "2h" }
  );

  res.json({
    message: "Login successful",
    token,
    patientId: patient.patientId
  });
});

module.exports = router;
