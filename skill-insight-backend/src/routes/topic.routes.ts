import { Router } from "express";
import {
  getTopics,
  getTopicsBySubject,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicById,
} from "../controllers/topic.controller";

// BẮT BUỘC: Import middleware xác thực từ auth.middleware
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// =====================================================
// GET ALL TOPICS
// =====================================================
router.get(
  "/",
  getTopics
);

// =====================================================
// GET TOPICS BY SUBJECT
// =====================================================
router.get(
  "/subject/:subjectId",
  getTopicsBySubject
);

// =====================================================
// GET TOPIC BY ID
// =====================================================

router.get(
  "/:id",
  getTopicById
);
// =====================================================
// CREATE TOPIC
// =====================================================
// ĐÃ SỬA: Chèn verifyToken vào giữa để giải mã Token gửi từ Angular lên và gán vào req.user
router.post(
  "/",
  verifyToken,
  createTopic
);

// =====================================================
// UPDATE TOPIC
// =====================================================
// Thêm verifyToken để bảo vệ API cập nhật chủ đề
router.put(
  "/:id",
  verifyToken,
  updateTopic
);

router.delete(
  "/:id",
  verifyToken,
  deleteTopic
);

export default router;
