import express from "express";
import {
  createTenant,
  getAllTenants
} from "../controllers/tenant.controller.js";

import { platformAuth } from "../../middlewares/platformAuth.middleware.js";

const router = express.Router();

// Only super-admin can access
// router.post("/", platformAuth, createTenant);
// router.get("/", platformAuth, getAllTenants);
router.post("/", platformAuth, createTenant);
// router.get("/", platformAuth, getAllTenants);

export default router;
