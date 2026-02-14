import jwt from "jsonwebtoken";
import getTenantConnection from "../utils/getTenantConnection.js";
import PlatformTenant from "../models/platform/tenant.model.js"; // main DB tenant model

const tenantAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, dbName, role } = decoded;

    if (!userId || !dbName || !role) {
      return res.status(401).json({
        message: "Invalid token payload"
      });
    }

    // 3️⃣ Check tenant still active (IMPORTANT for SaaS)
    const tenant = await PlatformTenant.findOne({ dbName });

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found"
      });
    }

    if (tenant.subscriptionExpiry < new Date()) {
      return res.status(403).json({
        message: "Subscription expired"
      });
    }

    if (!tenant.isActive) {
      return res.status(403).json({
        message: "Tenant account suspended"
      });
    }

    // 4️⃣ Connect to tenant database
    const tenantConnection = await getTenantConnection(dbName);

    if (!tenantConnection) {
      return res.status(500).json({
        message: "Unable to connect to tenant database"
      });
    }

    // 5️⃣ Attach to request
    req.tenantConnection = tenantConnection;

    req.user = {
      id: userId,
      role,
      dbName
    };

    next();

  } catch (error) {
    console.error("TenantAuth Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default tenantAuth;
