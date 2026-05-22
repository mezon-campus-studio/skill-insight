import prisma from "../lib/prisma";
import { AppError } from "../utils/appError";

// =====================================================
// TẠO CHỦ ĐỀ (CREATE TOPIC)
// =====================================================
export const createTopicService = async (
  topic_name: string,
  description: string | undefined,
  subject_id: number,
  user_id: number   
) => {

  // Đảm bảo biến ID người dùng luôn tồn tại và ép kiểu số nguyên chính xác
  const validUserId = Number(user_id);
  if (!validUserId || isNaN(validUserId)) {
    throw new AppError("Mã định danh người dùng không hợp lệ hoặc hết hạn phiên", 401);
  }

  const existingTopic = await prisma.topic.findFirst({
    where: {
      topic_name: {
        equals: topic_name.trim()
      },
      subject_id: Number(subject_id)
    }
  });

  // TỐI ƯU UX CHO IMPORT FILE: Nếu đã tồn tại chủ đề này trong môn học, 
  // tự động trả về thông tin cũ thay vì chặn lỗi 409 làm sập cả tiến trình import
  if (existingTopic) {
    return existingTopic;
  }

  // Thực hiện lưu trữ vào cơ sở dữ liệu với trường Unchecked gán thô tốc độ cao
  return prisma.topic.create({
    data: {
      topic_name: topic_name.trim(),
      description,
      subject_id: Number(subject_id),
      
      // ĐÃ SỬA CHÍNH XÁC: Đổi tên trường sang creator_id khớp 100% với schema.prisma của bạn
      creator_id: validUserId 
    },

    include: {
      subject: {
        select: {
          subject_id: true,
          subject_name: true
        }
      }
    }
  });
};

// =====================================================
// LẤY DANH SÁCH CHỦ ĐỀ (GET TOPICS)
// =====================================================
export const getTopicsService = async (
  page: number,
  limit: number,
  search: string,
  subject_id?: number
) => {

  const skip = (page - 1) * limit;
  const where: any = {};

  // SEARCH
  if (search) {
    where.topic_name = {
      contains: search
    };
  }

  // FILTER SUBJECT
  if (subject_id) {
    where.subject_id = Number(subject_id);
  }

  const [topics, totalItems] = await prisma.$transaction([
    prisma.topic.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc"
      },
      include: {
        subject: {
          select: {
            subject_id: true,
            subject_name: true
          }
        }
      }
    }),
    prisma.topic.count({
      where
    })
  ]);

  return {
    topics,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      limit
    }
  };
};

// =====================================================
// LẤY CHỦ ĐỀ THEO MÔN HỌC (GET TOPICS BY SUBJECT)
// =====================================================
export const getTopicsBySubjectService = async (subject_id: number) => {
  return prisma.topic.findMany({
    where: {
      subject_id: Number(subject_id)
    },
    orderBy: {
      topic_name: "asc"
    },
    select: {
      topic_id: true,
      topic_name: true
    }
  });
};

// =====================================================
// CẬP NHẬT CHỦ ĐỀ (UPDATE TOPIC)
// =====================================================
export const updateTopicService = async (
  topic_id: number,
  data: {
    topic_name?: string;
    description?: string;
  }
) => {

  const topic = await prisma.topic.findUnique({
    where: { topic_id: Number(topic_id) }
  });

  if (!topic) {
    throw new AppError("Topic không tồn tại", 404);
  }

  // CHECK DUPLICATE
  if (data.topic_name) {
    const existing = await prisma.topic.findFirst({
      where: {
        topic_name: {
          equals: data.topic_name.trim()
        },
        subject_id: topic.subject_id,
        NOT: {
          topic_id: Number(topic_id)
        }
      }
    });

    if (existing) {
      throw new AppError("Tên topic đã tồn tại trong môn học này", 409);
    }
  }

  return prisma.topic.update({
    where: { topic_id: Number(topic_id) },
    data: {
      ...data,
      topic_name: data.topic_name ? data.topic_name.trim() : undefined
    }
  });
};

// =====================================================
// XÓA CHỦ ĐỀ (DELETE TOPIC)
// =====================================================
export const deleteTopicService = async (topic_id: number) => {

  const topic = await prisma.topic.findUnique({
    where: { topic_id: Number(topic_id) }
  });

  if (!topic) {
    throw new AppError("Topic không tồn tại", 404);
  }

  // CHECK QUESTIONS
  const questionCount = await prisma.question.count({
    where: { topic_id: Number(topic_id) }
  });

  if (questionCount > 0) {
    throw new AppError("Topic đã có câu hỏi, không thể xóa", 400);
  }

  return prisma.topic.delete({
    where: { topic_id: Number(topic_id) }
  });
};

// =====================================================
// GET TOPIC BY ID
// =====================================================

export const getTopicByIdService = async (
  id: number
) => {

  return prisma.topic.findUnique({

    where: {
      topic_id: id
    }

  });

};