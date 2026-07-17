import { Router } from 'express';
import multer from 'multer';

import {

  // CRUD
  createExam,
  getExamById,
  updateExam,
  deleteExam,
  deleteManyExams,
  deleteAllExams,

  // FILTER
  getSubjects,
  getTopics,
  createSubject,
  createTopic,

  // EXAM LIST
  getMyExams,
  getTeacherExams,
  getSystemExams,
  getAllExams,

  // COPY
  copyExam,

  // IMPORT
  importExamExcel,

  // QUESTION
  removeQuestionFromExam,
  shuffleExamQuestions,

  // INTEGRATION
  integrateExam,
  cancelIntegrateExam,
  approveExam,
  rejectExam

} from '../controllers/exam.controller';

import { verifyToken } from '../middlewares/auth.middleware';

const upload = multer({
  storage: multer.memoryStorage()
});

const router = Router();

// ==========================================
// SUBJECT
// ==========================================

router.get(
  '/subjects/all',
  getSubjects
);

router.post(
  '/subjects',
  verifyToken,
  createSubject
);

// ==========================================
// TOPIC
// ==========================================

router.get(
  '/topics/all',
  getTopics
);

router.post(
  '/topics',
  verifyToken,
  createTopic
);

// ==========================================
// EXAM BANK
// ==========================================

// Đề của tôi
router.get(
  '/my',
  verifyToken,
  getMyExams
);

// Kho đề hệ thống
router.get(
  '/system',
  getSystemExams
);

// Kho đề giáo viên
router.get(
  '/teacher',
  getTeacherExams
);

// Admin
router.get(
  '/admin',
  verifyToken,
  getAllExams
);

// Angular gọi GET /api/exams
router.get(
  '/',
  verifyToken,
  getAllExams
);

// ==========================================
// DETAIL
// ==========================================

router.get(
  '/:id',
  getExamById
);

// ==========================================
// CREATE
// ==========================================

router.post(
  '/',
  verifyToken,
  upload.single('question_file'),
  createExam
);

// ==========================================
// UPDATE
// ==========================================

router.put(
  '/:id',
  verifyToken,
  updateExam
);

// ==========================================
// IMPORT EXCEL
// ==========================================

router.post(
  '/import',
  verifyToken,
  upload.single('file'),
  importExamExcel
);

// ==========================================
// QUESTION
// ==========================================

// Xóa câu hỏi khỏi đề
router.delete(
  '/:examId/questions/:questionId',
  verifyToken,
  removeQuestionFromExam
);

// Trộn câu hỏi
router.post(
  '/:examId/shuffle',
  verifyToken,
  shuffleExamQuestions
);

// ==========================================
// COPY
// ==========================================

router.post(
  '/:id/copy',
  verifyToken,
  copyExam
);

// ==========================================
// SYSTEM INTEGRATION
// ==========================================

// Gửi tích hợp
router.put(
  '/:id/integrate',
  verifyToken,
  integrateExam
);

// Hủy tích hợp
router.put(
  '/:id/cancel-integrate',
  verifyToken,
  cancelIntegrateExam
);

// Duyệt
router.put(
  '/:id/approve',
  verifyToken,
  approveExam
);

// Từ chối
router.put(
  '/:id/reject',
  verifyToken,
  rejectExam
);

// ==========================================
// DELETE
// ==========================================

// Xóa nhiều
router.post(
  '/delete-many',
  verifyToken,
  deleteManyExams
);

// Xóa tất cả
router.delete(
  '/',
  verifyToken,
  deleteAllExams
);

// Xóa một
router.delete(
  '/:id',
  verifyToken,
  deleteExam
);

export default router;