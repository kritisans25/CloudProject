const jwt = require("jsonwebtoken");
const users = require("../data/users");

exports.doctorLogin = (req, res) => {
  const { email, password } = req.body;
  const user = users.doctors[email];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "doctor", email }, process.env.JWT_SECRET, { expiresIn: "2h" });
  return res.json({ message: "Doctor login successful", token, email });
};
