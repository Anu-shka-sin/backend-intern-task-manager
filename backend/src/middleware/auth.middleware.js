const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    // Check if JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const authHeader = req.headers.authorization;

    // Check header format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info (id + role)
    req.user = decoded;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};