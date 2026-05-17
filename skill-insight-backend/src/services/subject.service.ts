import prisma from "../lib/prisma";
import { AppError } from "../utils/appError";
import { subjectRepository } from "../repositories/subject.repositories";
export const subjectService = {
  // CREATE
  createSubject: async (
    data: {
      subject_name: string;
      description?: string;
    },
    userId: number,
  ) => {
    const existing = await subjectRepository.findDuplicateSubject(
      data.subject_name,
      userId,
    );

    if (existing) {
      throw new AppError(
        "Tên môn học đã tồn tại. Vui lòng nhập tên khác.",
        409,
      );
    }
    return subjectRepository.create({
      ...data,
      created_by: userId,
    });
  },

  // GET ALL
  getAllSubjects: async (user: { userId: number; role: string }) => {
    // admin
    if (user.role === "admin") {
      return subjectRepository.findAll();
    }
    // teacher
    if (user.role === "teacher") {
      const admins = await prisma.user.findMany({
        where: {
          role: "admin",
        },

        select: {
          user_id: true,
        },
      });

      const adminIds = admins.map((admin) => admin.user_id);

      return subjectRepository.findSubjectsForTeacher(user.userId, adminIds);
    }
  },

  // FIND BY ID
  findById: async (id: number) => {
    return subjectRepository.findById(id);
  },

  //UPDATE
  updateSubject: async (
    id: number,
    data: {
      subject_name?: string;
      description?: string;
    },
    user: { userId: number; role: string },
  ) => {
    const subject = await subjectRepository.findById(id);
    if (!subject) {
      throw new AppError("không tìm thấy môn học", 404);
    }
    // teacher chỉ sửa của mình
    if (user.role === "teacher" && subject.created_by !== user.userId) {
      throw new AppError("Bạn không có quyền sửa môn này", 403);
    }
    // check duplicate
    if (data.subject_name) {
      const existing = await subjectRepository.findDuplicateSubject(
        data.subject_name,
        subject.created_by,
        id,
      );

      if (existing) {
        throw new AppError("Tên môn học đã tồn tại", 409);
      }
    }

    return subjectRepository.update(id, data);
  },

  //DELETE
  deleteSubject: async (id: number, user: { userId: number; role: string }) => {
    const subject = await subjectRepository.findById(id);

    if (!subject) {
      throw new AppError("Không tìm thấy môn học", 404);
    }

    // teacher chỉ xóa của mình
    if (user.role === "teacher" && subject.created_by !== user.userId) {
      throw new AppError("Bạn không có quyền xóa môn này", 403);
    }

    return subjectRepository.delete(id);
  },
};
