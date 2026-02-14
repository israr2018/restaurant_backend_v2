import jwt from "jsonwebtoken";
import PlatformUser from "../../platform/models/platformUsersModel.js";
import { getTenantConnection } from "../../shared/db/connectionManager.js";
import { getTenantUserModel } from "../models/tenantUserModel.js";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

export const tenantLogin = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    if (!email || !password || !code) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 1️⃣ Check tenant in platform DB
    const tenant = await PlatformUser.findOne({ code });

    if (!tenant) {
      return res.status(404).json({ message: "Invalid restaurant code" });
    }

    if (!tenant.isActive) {
      return res.status(403).json({ message: "Tenant is inactive" });
    }

    if (tenant.subscriptionExpiresAt < new Date()) {
      return res.status(403).json({ message: "Subscription expired" });
    }

    // 2️⃣ Connect to tenant DB
    const connection = getTenantConnection(tenant.dbName);

    const TenantUser = getTenantUserModel(connection);

    // 3️⃣ Find user in tenant DB
    const user = await TenantUser
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5️⃣ Generate JWT
    const token = generateToken({
      userId: user._id,
      role: user.role,
      dbName: tenant.dbName,
      code: tenant.code
    });

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
