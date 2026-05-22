import { Router } from "express";

import {
  createQuestion,
  getQuestions,
  getQuestionDetail,
  updateQuestion,
  deleteQuestion,
  integrateQuestion
} from "../controllers/question.controller";

import prisma from "../lib/prisma";

import {
  verifyToken,
  requireOwnership
} from "../middlewares/auth.middleware";

const router = Router();

// ======================================================
// GET ALL QUESTIONS
// ======================================================

router.get(
  "/",
  verifyToken,
  getQuestions
);

// ======================================================
// GET QUESTION DETAIL
// ======================================================

router.get(
  "/:id",
  verifyToken,
  getQuestionDetail
);

// ======================================================
// CREATE QUESTION
// ======================================================

router.post(
  "/",
  verifyToken,
  createQuestion
);

router.patch(
  '/:id/integrate',
  verifyToken,
  integrateQuestion
);

// ======================================================
// UPDATE QUESTION
// ======================================================

router.put(
  "/:id",
  verifyToken,

  requireOwnership(async (req) => {
    return prisma.question.findUnique({
      where: {
        question_id: Number(req.params.id)
      }
    });
  }),

  updateQuestion
);

// ======================================================
// DELETE QUESTION
// ======================================================

router.delete(
  "/:id",
  verifyToken,

  requireOwnership(async (req) => {
    return prisma.question.findUnique({
      where: {
        question_id: Number(req.params.id)
      }
    });
  }),

  deleteQuestion
);

export default router;