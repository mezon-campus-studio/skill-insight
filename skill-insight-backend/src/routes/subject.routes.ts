<<<<<<< HEAD
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
=======
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
>>>>>>> 7831c51b0f00e6b70f4c2d7230e7bc7f04f9e0b5
