import express from "express";
import {
  createCategory,
  getAllCategories,
  getPaginatedCategories,
  updateCategory,
  toggleIsActive,
  deleteCategory,
  getCategory
} from "../controllers/menuCategory.controller.js";

import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";
import tenantAuth from "../../middleware/tenantAuth.middleware.js";

const router = express.Router();

// All routes require login
router.use(tenantAuth);

// Create Category (admin only)
router.post('/', authorizeRoles("admin","owner"), createCategory);

// Get All (admin + staff)
router.get('/all', authorizeRoles("admin","owner","staff"), getAllCategories);

// Paginated
router.get('/', authorizeRoles("admin","owner","staff"), getPaginatedCategories);

// Update
router.put('/', authorizeRoles("admin","owner"), updateCategory);

// Toggle Active
router.put('/:id/toggle-is-active', authorizeRoles("admin","owner"), toggleIsActive);

// Delete
router.delete('/:id', authorizeRoles("owner"), deleteCategory);

// Get by ID
router.get('/:id', authorizeRoles("admin","owner","staff"), getCategory);

export default router;
