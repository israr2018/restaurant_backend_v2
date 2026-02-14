// models/main/Tenant.js

import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },

    dbName: {
      type: String,
      required: true,
      unique: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    subscription: {
      plan: {
        type: String,
        enum: ["3-month", "6-month", "12-month"],
        default: "3-month"
      },

      acquiredAt: {
        type: Date,
        required: true
      },

      expiresAt: {
        type: Date,
        required: true
      }
    },

    contactEmail: {
      type: String,
      lowercase: true
    },

    contactPhone: {
      type: String
    },

    address: {
      type: String
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model(tenantSchema, "tenant-users");