import {
  Request,
  Response,
  NextFunction
} from "express";

import prisma from "../lib/prisma";
import { subjectService } from "../services/subject.service";
import { AuthRequest } from "../middlewares/auth.middleware";

// =====================================================
// GET SUBJECTS
// =====================================================
export const getSubjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      page = 1,
      limit = 10,
      search = ""
    } = req.query;

    let result;

    if (user.role === "teacher") {
      result = await subjectService.getSubjectsByCreator(
        user.userId,
        Number(page),
        Number(limit),
        search as string
      );
    } else {
      result = await subjectService.getSubjects(
        Number(page),
        Number(limit),
        search as string
      );
    }

    return res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    next(error);
  }
};

// =====================================================
// CREATE SUBJECT
// =====================================================
export const createSubject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const subject = await subjectService.createSubject({
      ...req.body,
      created_by: user.userId
    });

    return res.status(201).json({
      success: true,
      message: "Tạo môn học thành công",
      subject
    });

  } catch (error) {
    next(error);
  }
};

// =====================================================
// CREATE BULK SUBJECTS
// =====================================================
export const createBulkSubjects = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const user = req.user;

    // =========================
    // AUTH CHECK
    // =========================
    if (!user) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });

    }

    const subjects = req.body;

    // =========================
    // VALIDATE INPUT
    // =========================
    if (
      !Array.isArray(subjects) ||
      subjects.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ"
      });

    }

    // =========================
    // GET EXISTING SUBJECTS
    // =========================
    const existingSubjects =
      await prisma.subject.findMany({

        select: {
          subject_name: true
        }

      });

    // normalize lowercase
    const existingSet = new Set(

      existingSubjects.map(subject =>

        subject.subject_name
          .trim()
          .toLowerCase()

      )

    );

    // =========================
    // PREPARE INSERT DATA
    // =========================
    const duplicated: string[] = [];

    const dataToInsert: {
      subject_name: string;
      description: string;
      created_by: number;
    }[] = [];

    for (const item of subjects) {

      const name = (
        item.subject_name || ''
      )
        .trim()
        .toLowerCase();

      // skip empty
      if (!name) {
        continue;
      }

      // duplicate DB or duplicate file
      if (existingSet.has(name)) {

        duplicated.push(
          item.subject_name
        );

        continue;

      }

      // add insert data
      dataToInsert.push({

        subject_name:
          item.subject_name.trim(),

        description:
          item.description || '',

        created_by:
          user.userId

      });

      // update set tránh trùng
      existingSet.add(name);

    }

    // =========================
    // BULK INSERT
    // =========================
    if (dataToInsert.length > 0) {

      await prisma.subject.createMany({

        data: dataToInsert,

        skipDuplicates: true

      });

    }

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({

      success: true,

      insertedCount:
        dataToInsert.length,

      duplicatedCount:
        duplicated.length,

      duplicated,

      message:
        `Đã thêm ${dataToInsert.length} môn học, ` +
        `${duplicated.length} môn đã tồn tại`

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Lỗi server"

    });

  }

};


export const getAllSubjects = async (
  req: Request,
  res: Response
) => {

  try {

    const subjects =
      await prisma.subject.findMany({

        orderBy: {
          subject_name: 'asc'
        }

      });

    return res.status(200).json({
      subjects
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Lỗi server'
    });

  }

};

// =====================================================
// UPDATE SUBJECT (OWNER CHECK)
// =====================================================
export const updateSubject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const subject = await subjectService.findById(id);

    // OWNER CHECK
    if (user.role !== "admin" && subject.created_by !== user.userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật môn học này",
      });
    }

    const updated = await subjectService.updateSubject(id, req.body);

    return res.json({
      success: true,
      message: "Cập nhật môn học thành công",
      subject: updated,
    });

  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE SUBJECT (OWNER CHECK)
// =====================================================
export const deleteSubject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const subject = await subjectService.findById(id);

    if (user.role !== "admin" && subject.created_by !== user.userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa môn học này",
      });
    }

    await subjectService.deleteSubject(id);

    return res.json({
      success: true,
      message: "Xóa môn học thành công",
    });

  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE MULTIPLE SUBJECTS (ROLE SAFE)
// =====================================================
export const deleteMultipleSubjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách ID không hợp lệ",
      });
    }

    const where =
      user.role === "admin"
        ? { subject_id: { in: ids } }
        : {
            subject_id: { in: ids },
            created_by: user.userId,
          };

    const result = await prisma.subject.deleteMany({ where });

    return res.status(200).json({
      success: true,
      message: `Đã xóa ${result.count} môn học`,
    });

  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE ALL SUBJECTS (ADMIN ONLY)
// =====================================================
export const deleteAllSubjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ONLY ADMIN
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin được xóa toàn bộ môn học",
      });
    }

    const result = await prisma.subject.deleteMany({});

    console.log(`ADMIN ${user.userId} deleted all subjects`);

    return res.status(200).json({
      success: true,
      message: `Đã xóa ${result.count} môn học`,
    });

  } catch (error) {
    next(error);
  }
};
