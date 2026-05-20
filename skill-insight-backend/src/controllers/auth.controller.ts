import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { generateToken, verifyToken } from "../utils/jwt";
import { AppError } from "../utils/appError";

const cookieOptions = {
  httpOnly: true,
  secure: false, 
  sameSite: "lax" as const, 
  path: "/",
  maxAge: 24 * 60 * 60 * 1000 
};

const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.cookies?.token || null;
};

export const getMezonUrl = async (req: Request, res: Response) => {
  try {
    const state = crypto.randomBytes(8).toString("hex");

    res.cookie("oauth_state", state, {
      ...cookieOptions,
      maxAge: 5 * 60 * 1000 
    });

    const clientId = process.env.MEZON_CLIENT_ID;
    const redirectUri = process.env.MEZON_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new AppError("Thiếu cấu hình MEZON trong file .env", 500);
    }

    const baseUrl = "https://oauth2.mezon.ai/oauth2/auth";
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid offline",
      state
    });

    return res.json({
      success: true,
      url: `${baseUrl}?${params.toString()}`
    });
  } catch (err) {
    console.error("❌ getMezonUrl Error:", err);
    return res.status(500).json({ success: false, message: "Lỗi kết nối Mezon" });
  }
};

export const mezonCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies?.oauth_state;

    if (!code || !state || state !== savedState) {
      return res.redirect("http://localhost:4200/login?error=state_khong_hop_le");
    }

    const { user, needSetPassword } = await authService.handleMezonLogin(code as string, state as string);

    const token = generateToken({
      userId: user.user_id,
      role: (user.role as string) || 'STUDENT'
    });

    res.cookie("token", token, cookieOptions);
    res.clearCookie("oauth_state");

    const redirectUrl = `http://localhost:4200/callback?token=${token}&needSetPassword=${needSetPassword}`;
    console.log("🚀 [OAUTH SUCCESS] Redirecting to Angular with token...");
    
    return res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const rawUser = await authService.getUserWithPassword(email);

    if (!rawUser || !rawUser.password) {
      throw new AppError("Email hoặc mật khẩu không đúng", 401);
    }

    const user = await userService.login(email, password);
    const token = generateToken({ 
      userId: user.user_id, 
      role: (user.role as string) || 'STUDENT' 
    });

    res.cookie("token", token, cookieOptions);

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      user,
      token,
      needSetPassword: !rawUser.password
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Bạn chưa đăng nhập", 401);

    const decoded: any = verifyToken(token);
    const user = await userService.getUserById(decoded.userId);

    return res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Đăng xuất thành công" });
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Bạn chưa đăng nhập", 401);

    const decoded: any = verifyToken(token);
    const { role } = req.body;

    const user = await userService.updateUserRole(decoded.userId, role);
    return res.json({ success: true, message: "Cập nhật vai trò thành công", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Cập nhật vai trò thất bại" });
  }
};

export const setPassword = async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Bạn chưa đăng nhập", 401);

    const decoded: any = verifyToken(token);
    const { password } = req.body;

    if (!password) throw new AppError("Mật khẩu không được để trống", 400);

    await userService.setUserPassword(decoded.userId, password);
    return res.json({ success: true, message: "Đặt mật khẩu thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Đặt mật khẩu thất bại" });
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.register(req.body);
    const token = generateToken({ 
      userId: user.user_id, 
      role: (user.role as string) || 'STUDENT' 
    });

    res.cookie("token", token, cookieOptions);
    return res.status(201).json({ success: true, message: "Đăng ký thành công", user, token, needSetPassword: false });
  } catch (error) { 
    next(error); 
  }
};
