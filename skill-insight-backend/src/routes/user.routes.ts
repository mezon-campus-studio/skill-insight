import express from "express";
import {
  getUsers,
  updateRole
} from "../controllers/user.controller";

import {
  verifyToken,
  requireRole
} from "../middlewares/auth.middleware";

const router = express.Router();

// ======================
// GET USERS (ADMIN ONLY)
// ======================
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  getUsers
);

// ======================
// UPDATE ROLE
// ======================
router.put(
  "/update-role",
  verifyToken,
  updateRole
);

// ======================
// ADMIN DASHBOARD
// ======================
router.get(
  "/admin",
  verifyToken,
  requireRole("admin"),
  getUsers
);

// ======================
// USER PROFILE
// ======================
router.get(
  "/profile",
  verifyToken,
  (req: any, res) => {
    res.json({
      success: true,
      data: req.user
    });
  }
);

export default router;