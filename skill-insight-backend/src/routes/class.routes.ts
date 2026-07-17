

import { Router } from "express";
import {
  createClassController,
  getClassesController,
  getClassByIdController,
  updateClassController,
  deleteClassController,
  deleteManyClassesController,
  addStudentController,
  removeStudentController,
  getStudentsController,
  assignExamController,
  joinClassController,
  getMyClassesController
} from "../controllers/class.controller";

import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/join",
  verifyToken,
  joinClassController
);

router.get(
  "/my",
  verifyToken,
  getMyClassesController
);

// CRUD lớp
router.get("/", getClassesController);

router.get("/:id", getClassByIdController);

router.post("/", createClassController);

router.put("/:id", updateClassController);

router.delete("/:id", deleteClassController);

router.post("/delete-many", deleteManyClassesController);

// Học sinh
router.post("/:id/students", addStudentController);

router.delete("/:id/students/:studentId", removeStudentController);

router.get("/:id/students", getStudentsController);

// Giao bài
router.post("/:id/exams", assignExamController);

export default router;