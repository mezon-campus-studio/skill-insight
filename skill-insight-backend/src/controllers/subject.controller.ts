import { Request, Response } from "express";
import { subjectService } from "../services/subject.service";
export const createSubject = async (req: Request, res: Response) => {
  try {
    const subject = await subjectService.createSubject(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Create failed" });
  }
};
export const getSubjects = async (req: Request, res: Response) => {
  const subjects = await subjectService.getAllSubjects();
  res.json(subjects);
};
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const subject = await subjectService.updateSubject(id, req.body);
    res.json(subject);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid id" });
    }
    await subjectService.deleteSubject(id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
