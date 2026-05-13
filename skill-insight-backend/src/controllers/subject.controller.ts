import { Request, Response } from "express";
import { subjectService } from "../services/subject.service";
import { AuthRequest } from "../middlewares/auth.middleware";
export const createSubject = async (req: AuthRequest, res: Response) => {
  try {
    const subject = await subjectService.createSubject(
      req.body,
      req.user!.userId,
    );
    res.status(201).json(subject);
  } catch (error) {
    return res.status(500).json({
      message: "Tạo môn học thất bại",
    });
  }
};
export const getSubjects = async (req: AuthRequest, res: Response) => {
  const subjects = await subjectService.getAllSubjects();
  res.json(subjects);
};
export const updateSubject = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }
    const subject = await subjectService.updateSubject(id, req.body, req.user!);
    res.json(subject);
  } catch {
    return res.status(500).json({
      message: "Cập nhật môn học thất bại",
    });
  }
};

export const deleteSubject = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }
    await subjectService.deleteSubject(id, req.user!);
    res.json({ message: "Đã xóa môn học" });
  } catch {
    return res.status(500).json({
      message: "Xóa môn học thất bại",
    });
  }
};
