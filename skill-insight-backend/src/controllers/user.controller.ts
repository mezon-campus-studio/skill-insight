import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

// ================= GET USERS =================
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;

    const data = await userService.getUsersService(page, limit);

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (
  req: any, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.body;

    // 🔥 validate
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required"
      });
    }
    
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await userService.updateUserRole(userId, role);

    res.status(200).json({
      success: true,
      message: "Cập nhật role thành công",
      data: user
    });

  } catch (err) {
    next(err);
  }
};