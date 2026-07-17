
import { Request, Response } from "express";
import * as classService from "../services/class.service";
import { AuthRequest } from "../middlewares/auth.middleware";

// =========================
// GET ALL CLASSES
// =========================
export const getClassesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await classService.getClasses(
      req.user!.userId
    );

    res.json(result);

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// GET CLASS BY ID
// =========================
export const getClassByIdController = async (
  req: Request,
  res: Response
) => {
     console.log("PARAMS =", req.params);

  try {
    const result = await classService.getClassById(
      req.params.id
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// CREATE CLASS
// =========================
export const createClassController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await classService.createClass({
      ...req.body,
      teacher_id: req.user!.userId,
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// UPDATE CLASS
// =========================
export const updateClassController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await classService.updateClass(
      req.params.id,
      req.body
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// DELETE CLASS
// =========================
export const deleteClassController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await classService.deleteClass(
      req.params.id
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// DELETE MANY CLASSES
// =========================
export const deleteManyClassesController = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await classService.deleteManyClasses(
        req.body.ids
      );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// ADD STUDENT
// =========================
export const addStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await classService.addStudent(
      req.params.id,
      req.body.studentId
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// REMOVE STUDENT
// =========================
export const removeStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await classService.removeStudent(
        req.params.id,
        req.params.studentId
      );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// GET STUDENTS
// =========================
export const getStudentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await classService.getStudents(
        req.params.id
      );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// ASSIGN EXAM
// =========================
export const assignExamController = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await classService.assignExam(
        req.params.id,
        req.body
      );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// JOIN CLASS
// =========================
export const joinClassController = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const result =
      await classService.joinClass(
        req.user!.userId,
        req.body.class_code
      );

    res.status(201).json({

      success: true,

      message: "Tham gia lớp thành công",

      data: result

    });

  } catch (error: any) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }

};

export const getMyClassesController = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const result =
      await classService.getMyClasses(

        req.user!.userId,

        req.user!.role

      );

    res.json({

      success: true,

      data: result

    });

  } catch (error: any) {

    res.status(500).json({

      message: error.message

    });

  }

};
