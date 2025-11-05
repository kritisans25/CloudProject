// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const dynamo = require("../dynamoClient");


// ✅ Doctor Login Route (Mock Authentication)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Temporary login credentials
  const doctors = [
    { email: "doctor@test.com", password: "1234" },
    { email: "doctor2@test.com", password: "1234" },
  ];

  const doctor = doctors.find(
    (d) => d.email === email && d.password === password
  );

  if (!doctor) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  res.json({
    success: true,
    message: "Login successful",
    doctorEmail: doctor.email,
  });
});


// ✅ Fetch all vitals for a specific doctor from DynamoDB
router.get("/vitals/:doctorEmail", async (req, res) => {
  const { doctorEmail } = req.params;

  try {
    const params = {
      TableName: "PatientVitals",
      FilterExpression: "doctorEmail = :d",
      ExpressionAttributeValues: {
        ":d": doctorEmail,
      },
    };

    const data = await dynamo.send(new ScanCommand(params));

    res.json({
      success: true,
      items: data.Items || [],
    });
  } catch (err) {
    console.error("❌ Error fetching vitals:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
