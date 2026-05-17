import express from "express";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subject.controller";
import {
  requireOwnership,
  requireRole,
  verifyToken,
} from "../middlewares/auth.middleware";
import { Request } from "express";
import { subjectService } from "../services/subject.service";
const router = express.Router();
// GET: tất cả đều xem được
router.get("/", verifyToken, requireRole("admin", "teacher"), getSubjects);
// CREATE: admin + teacher
router.post("/", verifyToken, requireRole("admin", "teacher"), createSubject);
// UPDATE
router.put(
  "/:id",
  verifyToken,
  requireRole("admin", "teacher"),
  requireOwnership((req: Request) =>
    subjectService.findById(Number(req.params.id)),
  ),
  updateSubject,
);
// DELETE
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin", "teacher"),
  requireOwnership((req: Request) =>
    subjectService.findById(Number(req.params.id)),
  ),
  deleteSubject,
);
export default router;
