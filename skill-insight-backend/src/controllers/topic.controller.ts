import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  createTopicService,
  getTopicsService,
  getTopicsBySubjectService,
  updateTopicService,
  deleteTopicService,
  getTopicByIdService,
} from "../services/topic.service";

// =====================================================
// LẤY DANH SÁCH CHỦ ĐỀ (GET TOPICS)
// =====================================================
export const getTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      subject_id
    } = req.query;

    const result =
      await getTopicsService(
        Number(page),
        Number(limit),
        search as string,
        subject_id
          ? Number(subject_id)
          : undefined
      );

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// LẤY CHỦ ĐỀ THEO MÔN HỌC (GET TOPICS BY SUBJECT)
// =====================================================
export const getTopicsBySubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subjectId =
      Number(req.params.subjectId);

    const topics =
      await getTopicsBySubjectService(
        subjectId
      );

    return res.status(200).json({
      success: true,
      count: topics.length,
      topics
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// LẤY CHI TIẾT CHỦ ĐỀ
// =====================================================

export const getTopicById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const id =
      Number(req.params.id);

    const topic =
      await getTopicByIdService(id);

    if (!topic) {

      return res.status(404).json({

        success: false,

        message:
          'Không tìm thấy topic'

      });

    }

    return res.status(200).json({

      success: true,

      topic

    });

  } catch (error) {

    next(error);

  }

};

// =====================================================
// TẠO CHỦ ĐỀ MỚI (CREATE TOPIC)
// =====================================================
export const createTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ GUARD BẮT BUỘC: Kiểm tra trạng thái đăng nhập hợp lệ
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { topic_name, description, subject_id } = req.body;

    // ĐÃ SỬA CHÍ MẠNG: Trích xuất linh hoạt ID người dùng từ Token (Chấp nhận cả userId hoặc user_id)
    // Sau đó ép kiểu dữ liệu rõ ràng sang dạng Số nguyên (Number) để Prisma connect chuẩn xác
    const userIdFromToken = req.user.userId || (req.user as any).user_id;

    const topic = await createTopicService(
      topic_name,
      description,
      Number(subject_id),
      Number(userIdFromToken) // 👈 Thay đổi cốt lõi truyền giá trị Số an toàn tại đây
    );

    return res.status(201).json({
      success: true,
      message: "Tạo topic thành công",
      topic
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CẬP NHẬT CHỦ ĐỀ (UPDATE TOPIC)
// =====================================================
export const updateTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id =
      Number(req.params.id);

    const {
      topic_name,
      description
    } = req.body;

    const topic =
      await updateTopicService(
        id,
        {
          topic_name,
          description
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Cập nhật topic thành công",
      topic
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// XÓA CHỦ ĐỀ (DELETE TOPIC)
// =====================================================
export const deleteTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id =
      Number(req.params.id);

    await deleteTopicService(id);

    return res.status(200).json({
      success: true,
      message:
        "Xóa topic thành công"
    });
  } catch (error) {
    next(error);
  }
};
