const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const { Server } = require("socket.io");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const dynamo = require("./dynamoClient");

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Import routes
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

// Create HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Initialize SNS client
const sns = new SNSClient({ region: "us-east-1" }); // ✅ your SNS region

// Demo patient → doctor mapping
const patientDoctorMap = {
  patient01: "doctor@test.com",
  patient02: "doctor@test.com",
  patient03: "doctor2@test.com",
};

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  // Doctor joins their private room
  socket.on("doctorJoin", (doctorEmail) => {
    socket.join(doctorEmail);
    console.log(`👨‍⚕️ Doctor joined: ${doctorEmail}`);
  });

  // Patient sends vitals
  socket.on("vitalsUpdate", async (data) => {
    const doctorEmail = patientDoctorMap[data.patientId];
    console.log(`📡 ${data.patientId} → ${doctorEmail}: new vitals`);
    console.log("🧾 Incoming data:", data);

    // Safety check
    if (!data || !data.patientId) {
      console.log("⚠️ Invalid vitals data received:", data);
      return;
    }

    // Emit to the doctor’s dashboard
    if (doctorEmail) io.to(doctorEmail).emit("vitalsUpdate", data);

    // Save to DynamoDB
    try {
      await dynamo.send(
        new PutCommand({
          TableName: "PatientVitals",
          Item: {
            patientId: data.patientId,
            timestamp: Date.now(), // number (not string)
            heartRate: Number(data.heartRate),
            bp_sys: Number(data.bp_sys),
            bp_dia: Number(data.bp_dia),
            oxygenLevel: Number(data.oxygenLevel),
            sugar: Number(data.sugar),
            temperature: Number(data.temperature),
            doctorEmail: doctorEmail,
          },
        })
      );
      console.log(`✅ Saved vitals for ${data.patientId} in DynamoDB`);
    } catch (err) {
      console.error("❌ DynamoDB save error:", err);
    }

    // --- SNS Alert Logic ---
    const hr = Number(data.heartRate);
    const sys = Number(data.bp_sys);
    const dia = Number(data.bp_dia);
    const oxy = Number(data.oxygenLevel);
    const sugar = Number(data.sugar);

    const abnormal = true; // 🔥 Force SNS alert for testing


    if (abnormal) {
      console.log("🚨 Abnormal vitals detected — preparing SNS alert...");

      try {
        const message = `
🚨 CRITICAL HEALTH ALERT 🚨

Doctor: ${doctorEmail}
Patient: ${data.patientId}

Abnormal vitals detected:
❤️ Heart Rate: ${hr} bpm
🩸 Blood Pressure: ${sys}/${dia}
🌬️ Oxygen Level: ${oxy}%
🍬 Sugar: ${sugar} mg/dL
🌡️ Temperature: ${data.temperature}°F

⚠️ Please check the patient immediately via the dashboard.
        `;

        await sns.send(
          new PublishCommand({
            TopicArn: "arn:aws:sns:us-east-1:072244248039:CriticalHealthAlerts", // your SNS topic ARN
            Message: message,
            Subject: `⚠️ ALERT for ${data.patientId} - Abnormal Vitals`,
          })
        );

        console.log(`✅ SNS Alert sent for ${data.patientId}`);
      } catch (err) {
        console.error("❌ SNS alert error:", err);
      }
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
