import jwt from "jsonwebtoken";
import PlatformUser from "../platform/models/platformUsersModel.js";

export const platformAuth = async (req, res, next) => {
  try {

    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Ensure it is platform user
    const user = await PlatformUser.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    if (user.role !== "super-admin") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account inactive"
      });
    }

    // 4️⃣ Attach user to request
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
};
