import express from "express";
import { mezonCallback } from "../controllers/auth.controller";

const router = express.Router();

router.post("/mezon/callback", mezonCallback);

export default router;
