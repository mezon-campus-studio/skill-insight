import express from "express";

import {
  login,
  register,
  updateRole,
  setPassword,
  getMe,
  logout,
  mezonCallback,
  getMezonUrl,
} from "../controllers/auth.controller";

const router = express.Router();

// ===== AUTH BASIC =====
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

// ===== USER =====
router.get("/me", getMe);

// ===== USER MANAGEMENT =====
router.post("/update-role", updateRole);
router.post("/set-password", setPassword);

// ===== MEZON OAUTH =====
router.get("/mezon/callback", mezonCallback);
router.get("/mezon/url", getMezonUrl);

export default router;
