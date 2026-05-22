<<<<<<< HEAD
import express from "express";
import {
  login,
  register,
  updateRole,
  setPassword,
  getMe,
  logout,
  getMezonUrl,
  mezonCallback,
  getUsers,
  getUserDetail,
  deleteUser,
  restoreUser,
  permanentlyDelete,
  toggleUserStatus
} from "../controllers/auth.controller";


const router = express.Router();
console.log("AUTH ROUTES LOADED");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", getMe);

router.get("/users", getUsers); 

router.put("/users/:id/role", updateRole); 
router.post("/set-password", setPassword);
router.get("/mezon", getMezonUrl);
router.get("/mezon/callback", mezonCallback);
router.get("/users/:id", getUserDetail);
router.put("/users/:id/status", toggleUserStatus);
router.put("/users/:id/restore", restoreUser); 
router.delete("/users/:id/permanent", permanentlyDelete);
router.delete("/users/:id", deleteUser); 

export default router;
=======
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
>>>>>>> 7831c51b0f00e6b70f4c2d7230e7bc7f04f9e0b5
