import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
const disableCache = (res: Response) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const user = await userService.getUserById(id);

    disableCache(res);

    res.status(200).json({
      success: true,
      message: "Lấy thông tin user thành công",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;

    const keyword = (req.query.keyword as string) || "";
    const role = (req.query.role as string) || "";

    console.log("KEYWORD =", keyword);
    console.log("ROLE =", role);

    const data = await userService.getUsersService(
      page,
      limit,
      keyword,
      role
    );

    disableCache(res);

    res.status(200).json({
      success: true,
      message: "Lấy danh sách user thành công",
      data
    });
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);

    const data = await userService.toggleUserStatusService(userId);

    disableCache(res);

    res.status(200).json({
      success: true,
      message:
        data.status === true
          ? "Mở tài khoản thành công"
          : "Đóng tài khoản thành công",
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
    const userId = req.user?.user_id;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required"
      });
    }

    const data = await userService.updateUserRole(
      userId,
      role
    );

    disableCache(res);

    res.status(200).json({
      success: true,
      message: "Chọn role thành công",
      data
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserRoleByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required"
      });
    }

    const user = await userService.updateUserRole(
      userId,
      role
    );

    disableCache(res);

    res.status(200).json({
      success: true,
      message: "Admin cập nhật role thành công",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUserByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);

    await userService.deleteUserService(userId);

    disableCache(res);

    res.status(200).json({
      success: true,
      message: "Xóa user thành công"
    });
  } catch (err) {
    next(err);
  }
};

export const createUserByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await userService.createUserByAdmin(req.body);

    disableCache(res);

    res.status(201).json({
      success: true,
      message: "Tạo user thành công",
      data
    });
  } catch (err) {
    next(err);
  }
};