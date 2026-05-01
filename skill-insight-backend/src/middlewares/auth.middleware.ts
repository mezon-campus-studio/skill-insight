import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError("Chưa đăng nhập", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError("Token không hợp lệ", 401));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return next(new AppError("Không có quyền truy cập", 403));
    }

    next();
  };
};