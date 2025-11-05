// src/data/users.js
// ⚠️ Only for local testing — not for production.

module.exports = {
  doctors: {
    "doctor@test.com": {
      email: "doctor@test.com",
      password: "1234",
      name: "Dr. John Doe",
      role: "doctor"
    },
    "doctor2@test.com": {
      email: "doctor2@test.com",
      password: "1234",
      name: "Dr. Smith",
      role: "doctor"
    }
  },

  patients: {
    "patient01@mail.com": {
      email: "patient01@mail.com",
      password: "pass123",
      patientId: "patient01",
      role: "patient"
    },
    "patient02@mail.com": {
      email: "patient02@mail.com",
      password: "pass123",
      patientId: "patient02",
      role: "patient"
    },
    "patient03@mail.com": {
      email: "patient03@mail.com",
      password: "pass123",
      patientId: "patient03",
      role: "patient"
    }
  }
};
