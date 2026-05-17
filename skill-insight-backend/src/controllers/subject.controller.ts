import { Request, Response } from "express";
import { subjectService } from "../services/subject.service";
import { AuthRequest } from "../middlewares/auth.middleware";
export const createSubject = async (req: AuthRequest, res: Response) => {
  try {
    // chưa login
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập",
      });
    }
    const subject = await subjectService.createSubject(
      req.body,
      req.user!.userId,
    );
    return res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Tạo môn học thất bại",
    });
  }
};
export const getSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await subjectService.getAllSubjects(req.user!);

    return res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Lấy danh sách môn học thất bại",
    });
  }
};
export const updateSubject = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }
    const subject = await subjectService.updateSubject(id, req.body, req.user!);
    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Cập nhật môn học thất bại",
    });
  }
};

export const deleteSubject = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }
    await subjectService.deleteSubject(id, req.user!);
    return res.status(200).json({
      success: true,
      message: "Đã xóa môn học",
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Xóa môn học thất bại",
    });
  }
};
