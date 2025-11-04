const jwt = require("jsonwebtoken");

// ✅ Middleware: Authenticate user by verifying JWT
exports.authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ decoded will contain { id, email, role, ... }
    req.user = decoded;

    // console.log("Authenticated user:", decoded); // optional debugging
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Middleware: Restrict access by role
exports.authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} is not allowed to access this route.`,
      });
    }

    next();
  };
};
