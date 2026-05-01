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

router.get(
  "/:id",
  verifyToken,
  getUser
);

router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  getUsers
);

router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  createUserByAdmin
);

router.put(
  "/role",
  verifyToken,
  updateRole
);

router.put(
  "/:id/role",
  verifyToken,
  requireRole("admin"),
  updateUserRoleByAdmin
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  deleteUserByAdmin
);

export default router;