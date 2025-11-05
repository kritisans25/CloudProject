const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.patientLogin = (req, res) => {
  console.log("Request body:", req.body);
  const { email, password } = req.body;

  // ✅ Compare credentials from .env
  if (email === process.env.PATIENT_EMAIL && password === process.env.PATIENT_PASSWORD) {
    console.log(`✅ Patient login successful for ${email}`);

    // Create a token for the patient
    const token = jwt.sign(
      {
        role: "patient",
        email,
        patientId: process.env.PATIENT_ID,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Patient login successful ✅",
      token,
    });
  } else {
    console.log("❌ Invalid credentials entered.");
    return res.status(401).json({ message: "Invalid credentials" });
  }
};
