import { Router } from 'express';

import {
  createExam,
  getExams,
  getExamById,
  deleteExam,
  deleteManyExams,
  deleteAllExams,
  getSubjects,
  getTopics
} from '../controllers/exam.controller';

const router = Router();

// =========================
// SUBJECTS
// =========================
router.get(
  '/subjects/all',
  getSubjects
);

// =========================
// TOPICS
// =========================
router.get(
  '/topics/all',
  getTopics
);

// =========================
// EXAMS
// =========================

// GET ALL EXAMS
router.get(
  '/',
  getExams
);

// CREATE EXAM
router.post(
  '/',
  createExam
);

// DELETE MANY
router.post(
  '/delete-many',
  deleteManyExams
);

// DELETE ALL
router.delete(
  '/',
  deleteAllExams
);

// GET EXAM BY ID
router.get(
  '/:id',
  getExamById
);

// DELETE ONE
router.delete(
  '/:id',
  deleteExam
);

export default router;