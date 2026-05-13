import prisma from "../lib/prisma";
import { AppError } from "../utils/appError";

export const subjectService = {
  // ===== CREATE =====
  createSubject: async (
    data: {
      subject_name: string;
      description?: string;
    },
    userId: number,
  ) => {
    const existing = await prisma.subject.findUnique({
      where: { subject_name: data.subject_name },
    });

    if (existing) {
      throw new AppError(
        "Tên môn học đã tồn tại. Vui lòng nhập tên khác.",
        409,
      );
    }
    return prisma.subject.create({
      data: {
        ...data,
        created_by: userId,
      },
    });
  },

  // ===== GET ALL =====
  getAllSubjects: async () => {
    return prisma.subject.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  // ===== FIND BY ID (cực quan trọng cho ownership) =====
  findById: async (id: number) => {
    return prisma.subject.findUnique({
      where: { subject_id: id },
    });
  },

  // ===== UPDATE =====
  updateSubject: async (
    id: number,
    data: {
      subject_name?: string;
      description?: string;
    },
    user: { userId: number; role: string },
  ) => {
    const subject = await prisma.subject.findUnique({
      where: { subject_id: id },
    });
    if (!subject) {
      throw new AppError("không tìm thấy môn học", 404);
    }
    if (data.subject_name) {
      const existing = await prisma.subject.findFirst({
        where: {
          subject_name: data.subject_name,
          NOT: { subject_id: id }, // tránh check chính nó
        },
      });

      if (existing) {
        throw new AppError(
          "Tên môn học đã tồn tại. Vui lòng nhập tên khác.",
          409,
        );
      }
    }
    if (user.role === "teacher" && subject.created_by !== user.userId) {
      throw new AppError("Bạn không có quyền chỉnh sửa môn học này", 403);
    }
    return prisma.subject.update({
      where: { subject_id: id },
      data,
    });
  },

  // ===== DELETE =====
  deleteSubject: async (id: number, user: { userId: number; role: string }) => {
    const subject = await prisma.subject.findUnique({
      where: { subject_id: id },
    });

    if (!subject) {
      throw new AppError("Không tìm thấy môn học", 404);
    }

    if (user.role === "teacher" && subject.created_by !== user.userId) {
      throw new AppError("Bạn không có quyền xóa môn học này", 403);
    }

    return prisma.subject.delete({
      where: { subject_id: id },
    });
  },
};
