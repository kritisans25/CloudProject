const jwt = require("jsonwebtoken");

exports.patientLogin = (req, res) => {
    const { email, password } = req.body;

    if (email === "patient@test.com" && password === "1234") {
        const token = jwt.sign(
            { role: "patient", email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({ message: "Patient login successful ✅", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
};
