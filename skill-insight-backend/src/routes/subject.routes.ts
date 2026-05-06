import express from "express";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subject.controller";
const router = express.Router();
router.post("/", createSubject);
router.get("/", getSubjects);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);
export default router;
