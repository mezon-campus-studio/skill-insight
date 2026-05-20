import { Router } from "express";

import {
  getResultById,
} from "../controllers/result.controller";

const router = Router();

router.get("/:id", getResultById);

export default router;