import { Request, Response, NextFunction } from "express";
import {
  loginService,
  registerService
} from "../services/user.service";

// ======================
// LOGIN
// ======================
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body; 

    const data = await loginService(email, password);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data
    });
  } catch (error) {
    next(error);
  }
};

// ======================
// REGISTER
// ======================
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data
    });
  } catch (error) {
    next(error);
  }
};