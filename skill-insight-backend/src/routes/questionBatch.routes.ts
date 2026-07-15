import express from "express";

import {
  createQuestionBatch,
  getQuestionBatches,
  getQuestionBatchById,
  addQuestionsToBatch,
  approveBatch,
  deleteQuestionBatch,
  removeQuestionFromBatch,
  importQuestionBatchExcel,
  updateQuestion,
  createQuestionInBatch,
  updateBatchQuestions,
  getAllQuestionBatches,
  getMyQuestionBatches,
  getSystemQuestionBatches,
  getTeacherPublicQuestionBatches,
  copyQuestionBatch,
  integrateQuestionBatch

} from "../controllers/questionBatch.controller";

import upload from "../middlewares/upload.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

// ======================================================
// CREATE BATCH
// ======================================================
router.post(
  "/",
  verifyToken,
  createQuestionBatch
);

// ======================================================
// IMPORT EXCEL
// ======================================================
router.post(
  "/import",
  verifyToken,
  upload.single("file"),
  importQuestionBatchExcel
);

// ======================================================
// GET ALL
// ======================================================
router.get(
  "/",
  verifyToken,
  getQuestionBatches
);

router.get(
  "/all",
  verifyToken,
  getAllQuestionBatches
);

router.get(
  "/my",
  verifyToken,
  getMyQuestionBatches
);

router.get(
  "/system",
  verifyToken,
  getSystemQuestionBatches
);

router.get(
  "/teacher-public",
  verifyToken,
  getTeacherPublicQuestionBatches
);

// ======================================================
// ADD MULTIPLE QUESTIONS TO BATCH
// ======================================================
router.post(
  "/:id/questions",
  verifyToken,
  addQuestionsToBatch
);

// ======================================================
// CREATE SINGLE QUESTION IN BATCH
// ======================================================
router.post(
  "/:id/question",
  verifyToken,
  createQuestionInBatch
);

// ======================================================
// UPDATE MULTIPLE QUESTIONS (SAVE ALL - GOOGLE DOCS STYLE)
// ======================================================
router.put(
  "/:id/questions",
  verifyToken,
  updateBatchQuestions
);

// ======================================================
// REMOVE QUESTION FROM BATCH
// ======================================================
router.delete(
  "/:batchId/questions/:questionId",
  verifyToken,
  removeQuestionFromBatch
);

// ======================================================
// APPROVE BATCH
// ======================================================
router.patch(
  "/:id/approve",
  verifyToken,
  approveBatch
);

// ======================================================
// DELETE BATCH
// ======================================================
router.delete(
  "/:id",
  verifyToken,
  deleteQuestionBatch
);

// ======================================================
// UPDATE SINGLE QUESTION (GLOBAL)
// ======================================================
router.put(
  "/questions/:id",
  verifyToken,
  updateQuestion
);



router.post(
  "/:id/copy",
  verifyToken,
  copyQuestionBatch
);

router.patch(
  "/:id/integrate",
  verifyToken,
  integrateQuestionBatch
);

// ======================================================
// GET DETAIL
// ======================================================
router.get(
  "/:id",
  verifyToken,
  getQuestionBatchById
);

export default router;