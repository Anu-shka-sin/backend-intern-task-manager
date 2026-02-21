exports.allowRoles = (...roles) => {
  return (req, res, next) => {

    // Check if user exists (verifyToken must run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated"
      });
    }

    // Check if role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied"
      });
    }

    next();
  };
};