import express from "express";

import {
  getUsers,
  getUser,
  updateRole,
  updateUserRoleByAdmin,
  deleteUserByAdmin,
  createUserByAdmin
} from "../controllers/user.controller";

import {
  verifyToken,
  requireRole
} from "../middlewares/auth.middleware";

const router = express.Router();

// ======================
// PROFILE
// ======================
router.get(
  "/profile",
  verifyToken,
  (req: any, res) => {
    res.json({
      success: true,
      successMessage: "Lấy thông tin profile thành công",
      data: req.user
    });
  }
);

// ======================
// GET 1 USER
// ======================
router.get(
  "/:id",
  verifyToken,
  getUser
);

// ======================
// GET USERS (ADMIN)
// ======================
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  getUsers
);

// ======================
// 🔥 CREATE USER (ADMIN)
// ======================
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  createUserByAdmin
);

// ======================
// USER SELF UPDATE ROLE
// ======================
router.put(
  "/role",
  verifyToken,
  updateRole
);

// ======================
// ADMIN UPDATE ROLE
// ======================
router.put(
  "/:id/role",
  verifyToken,
  requireRole("admin"),
  updateUserRoleByAdmin
);

// ======================
// DELETE USER (ADMIN)
// ======================
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  deleteUserByAdmin
);

export default router;