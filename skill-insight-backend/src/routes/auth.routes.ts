import express from "express";
import { login, register } from "../controllers/auth.controller";

const router = express.Router();

// ======================
// LOGIN
// ======================
router.post("/login", login);

// ======================
// REGISTER
// ======================
router.post("/register", register);

export default router;