const jwt = require("jsonwebtoken");

exports.doctorLogin = (req, res) => {
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    // Temporary mock authentication
    if (email === "doctor@test.com" && password === "1234") {
        console.log("Doctor login request:", email);

        // Generate a JWT token
        const token = jwt.sign(
            { role: "doctor", email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({ message: "Doctor login successful ✅", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
};
