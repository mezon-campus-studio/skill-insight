import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";

import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment
} from "../controllers/assignment.controller";

const router = Router();

router.post(
  "/",
  verifyToken,
  createAssignment
);

router.get(
  "/",
  verifyToken,
  getAssignments
);

router.get(
  "/:id",
  verifyToken,
  getAssignmentById
);

router.delete(
  "/:id",
  verifyToken,
  deleteAssignment
);

export default router;