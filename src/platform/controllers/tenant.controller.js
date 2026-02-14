import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import PlatformUser from "../models/platformUser.js";
import { getTenantUserModel } from "src/models/tenant/tenantUserModel.js";

export const createRestaurantOwner = async (req, res) => {
    try {
      const {
        businessName,
        email,
        password,
        mobile,
        address,
        subscriptionPlan,
        purchaseDate
      } = req.body;
  
      // 1️⃣ Validate required fields
      if (!businessName || !email || !password || !subscriptionPlan) {
        return res.status(400).json({
          message: "Required fields are missing"
        });
      }
  
      // 2️⃣ Check if email already exists
      const existingUser = await PlatformUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already registered"
        });
      }
  
      // 3️⃣ Generate new unique code
      const lastUser = await PlatformUser.findOne({
        role: "restaurant_owner"
      }).sort({ createdAt: -1 });
  
      let newCodeNumber = 1;
  
      if (lastUser && lastUser.code) {
        const lastNumber = parseInt(lastUser.code.substring(1));
        newCodeNumber = lastNumber + 1;
      }
  
      const newCode = `C${String(newCodeNumber).padStart(6, "0")}`;
  
      // 4️⃣ Generate tenant database name
      const dbName = `tenant_${newCode.toLowerCase()}`;
  
      // 5️⃣ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 6️⃣ Save in platform database
      const newOwner = await PlatformUser.create({
        businessName,
        email,
        password: hashedPassword,
        mobile,
        address,
        subscriptionPlan,
        purchaseDate,
        role: "restaurant_owner",
        code: newCode,
        dbName,
        status: "active"
      });
  
      // 7️⃣ Create Tenant Database & Initialize Collections
      const tenantConnection = getTenantConnection(dbName);
  
      // const tenantConnection = getTenantConnection(dbName);
  
      const TenantUser = getTenantUserModel(tenantConnection);
      
      await TenantUser.create({
        name: businessName,
        email,
        password,
        role: "admin"
      });
      
      tenantConnection.model("TenantUser", tenantUserSchema);
  
      // Optional: create owner inside tenant DB as admin
      // const TenantUser = tenantConnection.model("TenantUser");
  
      await TenantUser.create({
        name: businessName,
        email,
        password: hashedPassword,
        role: "admin"
      });
  
      return res.status(201).json({
        message: "Restaurant owner created successfully",
        code: newCode,
        dbName
      });
  
    } catch (error) {
      console.error("Create Restaurant Owner Error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  };