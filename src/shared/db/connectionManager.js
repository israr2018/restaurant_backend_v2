import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import PlatformUser from "../models/platformUser.js";

// in-memory connection cache
const connections = {};

function getTenantConnection(dbName) {
  if (!connections[dbName]) {
    connections[dbName] = mongoose.createConnection(
      `${process.env.MONGO_URI}/${dbName}`
    );
  }
  return connections[dbName];
}
