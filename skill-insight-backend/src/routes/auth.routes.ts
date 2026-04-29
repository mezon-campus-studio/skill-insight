import express from "express";
import { mezonCallback, login } from "../controllers/auth.controller";

const router = express.Router();

router.get("/mezon/callback", mezonCallback);
router.get("/mezon/login", login);
export default router;
