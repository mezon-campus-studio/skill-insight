
import express, { Request } from "express";

import {
  createSubject,
  getSubjects,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  createBulkSubjects,
  deleteMultipleSubjects,
  deleteAllSubjects
} from "../controllers/subject.controller";

import {
  verifyToken,
  requireRole,
  requireOwnership,
} from "../middlewares/auth.middleware";

import { subjectService } from "../services/subject.service";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  getSubjects
);

router.get(
  '/all',
  getAllSubjects
);

router.post(
  "/",
  verifyToken,
  requireRole("admin", "teacher"),
  createSubject
);

router.post(
  "/bulk",
  verifyToken,
  requireRole("admin", "teacher"),
  createBulkSubjects
);

router.delete(
  "/",
  verifyToken,
  requireRole("admin"),
  deleteAllSubjects
);



router.post(
  "/delete-multiple",
  verifyToken,
  requireRole("admin", "teacher"),
  deleteMultipleSubjects
);

router.put(
  "/:id",
  verifyToken,

  requireRole("admin", "teacher"),

  requireOwnership(
    async (req: Request) => {

      return await subjectService.findById(
        Number(req.params.id)
      );

    }
  ),

  updateSubject
);

router.delete(
  "/:id",
  verifyToken,

  requireRole("admin", "teacher"),

  requireOwnership(
    async (req: Request) => {

      return await subjectService.findById(
        Number(req.params.id)
      );

    }
  ),

  deleteSubject
);

export default router;
