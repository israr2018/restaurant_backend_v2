// src/platform/models/platformUsersModel.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PlatformUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["super-admin", "restaurant-admin"],
      required: true
    },

    code: {
      type: String,
      unique: true,
      sparse: true // only restaurant-admin will have this
    },

    dbName: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    },

    subscriptionAcquiredAt: Date,

    subscriptionExpiresAt: Date
  },
  { timestamps: true }
);

// 🔐 Password Hash Middleware
PlatformUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const PlatformUser = mongoose.model(
  "PlatformUser",
  PlatformUserSchema,
  "platform-users" // explicit collection name
);

export default PlatformUser;
