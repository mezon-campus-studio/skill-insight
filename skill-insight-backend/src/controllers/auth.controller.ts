import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../utils/jwt";
import { AppError } from "../utils/appError";

// ===== Cookie config =====
const cookieOptions = {
  httpOnly: true,
  secure: false, // production -> true
  sameSite: "lax" as const,
  path: "/",
};

const accessTokenCookie = {
  ...cookieOptions,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const refreshTokenCookie = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ===== Extract token =====
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.cookies?.accessToken || null;
};

// ===== OAuth callback =====
export const mezonCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Missing code" });
    }
    if (!state) {
      return res.status(400).json({ message: "Invalid state" });
    }
    const result = await authService.handleMezonLogin(
      code as string,
      state as string,
    );

    return res.redirect(
      `${process.env.REDIRECT_URI}?token=${result.accessToken}`,
    );
  } catch (error: any) {
    console.error("OAuth callback error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
// ===== URL OAuth ====
export const getMezonUrl = async (req: Request, res: Response) => {
  try {
    const url = await authService.getAuthUrl();
    return res.json({ success: true, url });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi tạo URL OAuth" });
  }
};
// ===== Login =====
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
    );

    res.cookie("accessToken", accessToken, accessTokenCookie);
    res.cookie("refreshToken", refreshToken, refreshTokenCookie);

    return res.json({
      success: true,
      user,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ===== Register =====
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.register(req.body);

    const accessToken = generateAccessToken({
      userId: user.user_id,
      email: user.email,
      role: user.role!,
    });

    const refreshToken = generateRefreshToken({
      userId: user.user_id,
      email: user.email,
      role: user.role!,
    });

    res.cookie("accessToken", accessToken, accessTokenCookie);
    res.cookie("refreshToken", refreshToken, refreshTokenCookie);

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===== Get current user =====
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Chưa đăng nhập", 401);

    const decoded = verifyAccessToken(token);
    const user = await userService.getUserById(decoded.userId);

    return res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ===== Logout =====
export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ success: true });
};

// ===== Update role =====
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Chưa đăng nhập", 401);

    const decoded = verifyAccessToken(token);
    const { role } = req.body;

    const user = await userService.updateUserRole(decoded.userId, role);

    return res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ===== Set password =====
export const setPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Chưa đăng nhập", 401);

    const decoded = verifyAccessToken(token);
    const { password } = req.body;

    await userService.setUserPassword(decoded.userId, password);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
