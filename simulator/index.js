const axios = require("axios");//we imported axios to make http post request to our api gateway

const API_URL = "https://2yyap1c8qj.execute-api.us-east-1.amazonaws.com/prod/vitals";  // this triggers the lambda function through api gateway

function generateVitals() {
    return {
        patientId: "patient01",
        timestamp: Date.now(),
        heartRate: Math.floor(Math.random() * (110 - 60)) + 60,   // 60-110
        bp_sys: Math.floor(Math.random() * (130 - 100)) + 100,    // 100-130
        bp_dia: Math.floor(Math.random() * (90 - 60)) + 60,       // 60-90
        sugar: Math.floor(Math.random() * (150 - 80)) + 80,       // 80-150
        temperature: (Math.random() * (100 - 97) + 97).toFixed(1),// 97.0 - 100.0
        oxygenLevel: Math.floor(Math.random() * (100 - 92)) + 92  // 92-100
    };
}
// Function to send vitals to the API Gateway
async function sendVitals() {
    const vitals = generateVitals();
    try {
        const res = await axios.post(API_URL, vitals);
        console.log("✅ Sent vitals:", vitals);
    } catch (err) {
        console.error("❌ Error sending vitals", err.response?.data || err.message);
    }
}

// Send vitals every 5 seconds
setInterval(sendVitals, 5000);
