import { Request, Response } from "express";
import * as assignmentService from "../services/assignment.service";

export const createAssignment = async (
  req: any,
  res: Response
) => {
  try {

    const teacherId = req.user.userId;

    const assignment =
      await assignmentService.createAssignment({

        ...req.body,

        teacher_id: teacherId

      });

    return res.status(201).json({

      success: true,

      message: "Giao đề thi thành công.",

      data: assignment

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        error.message || "Không thể giao đề thi."

    });

  }
};

export const getAssignments = async (
  req: Request,
  res: Response
) => {

  try {

    const data =
      await assignmentService.getAssignments();

    return res.json({

      success: true,

      data

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

export const getAssignmentById = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const data =
      await assignmentService.getAssignmentById(id);

    if (!data) {

      return res.status(404).json({

        success: false,

        message: "Không tìm thấy bài giao."

      });

    }

    return res.json({

      success: true,

      data

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

export const deleteAssignment = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    await assignmentService.deleteAssignment(id);

    return res.json({

      success: true,

      message: "Đã xoá giao đề."

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

