const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      try {
        // 1️⃣ Check if user exists (tenantAuth must run before this)
        if (!req.user || !req.user.role) {
          return res.status(401).json({
            message: "Unauthorized. User information missing."
          });
        }
  
        // 2️⃣ Check if role is allowed
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            message: "Forbidden. You do not have permission to perform this action."
          });
        }
  
        next();
  
      } catch (error) {
        return res.status(500).json({
          message: "Role authorization error",
          error: error.message
        });
      }
    };
  };
  
  export default authorizeRoles;
  