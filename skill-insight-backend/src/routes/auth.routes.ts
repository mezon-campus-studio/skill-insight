import express from "express";

import {
  login,
  register,
  updateRole,
  setPassword,
  getMe,
  logout,
  getMezonUrl,
  mezonCallback
} from "../controllers/auth.controller";

const router = express.Router();

console.log("AUTH ROUTES LOADED");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

router.get("/me", getMe);

router.post("/update-role", updateRole);
router.post("/set-password", setPassword);

router.get("/mezon", getMezonUrl);
router.get("/mezon/callback", mezonCallback);

export default router;