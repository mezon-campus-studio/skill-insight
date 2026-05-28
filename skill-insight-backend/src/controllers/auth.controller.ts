import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import {
  generateAccessToken,
  verifyAccessToken
} from "../utils/jwt";
import { AppError } from "../utils/appError";
import {
  disableUserService,
  deleteUserService,
  restoreUserService,
  permanentlyDeleteUserService,
  toggleUserStatusService
} from "../services/user.service";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const, 
  path: "/",
  maxAge: 5 * 60 * 1000 
};

/**
 * Trích xuất token từ Header Bearer
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

// 1. Lấy URL đăng nhập Mezon
export const getMezonUrl = async (req: Request, res: Response) => {
  try {
    const state = crypto.randomBytes(8).toString("hex");
    res.cookie("oauth_state", state, cookieOptions);

    const params = new URLSearchParams({
      client_id: process.env.MEZON_CLIENT_ID || "",
      redirect_uri: process.env.MEZON_REDIRECT_URI || "",
      response_type: "code",
      scope: "openid offline",
      state
    });

    return res.json({
      success: true,
      url: `https://oauth2.mezon.ai/oauth2/auth?${params.toString()}`
    }); 
  } catch (err) {
    return res.status(500).json({ success: false, message: "Lỗi kết nối Mezon" });
  }
};

// 2. Mezon Callback
export const mezonCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies?.oauth_state;

    if (!code || !state || state !== savedState) {
      console.error("--- [LỖI] STATE KHÔNG KHỚP ---");
    }

    const { user, needSetPassword } = await authService.handleMezonLogin(code as string, state as string);

    const token = generateAccessToken({ 
      userId: user.user_id, 
      role: (user.role as string) || 'student' 
    });

    res.clearCookie("oauth_state");

    const finalUrl = `http://localhost:4200/callback?token=${encodeURIComponent(token)}&needSetPassword=${needSetPassword}`;
    console.log("--- [REDIRECTING] --->", finalUrl);

    return res.redirect(finalUrl);
  } catch (error: any) {
    console.error("--- [LỖI CALLBACK BACKEND]:", error.message);
    return res.redirect(`http://localhost:4200/login?error=auth_failed`);
  }
};

// 3. Đăng nhập truyền thống
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    const token = generateAccessToken({ userId: result.user_id, role: (result.role as string) || 'student' });
    return res.json({ success: true, user: result, token });
  } catch (error) { next(error); }
};

// 4. Đăng ký tài khoản
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.register(req.body);
    const token = generateAccessToken({ userId: user.user_id, role: (user.role as string) || 'student' });
    return res.status(201).json({ success: true, message: "Đăng ký thành công", user, token });
  } catch (error) { next(error); }
};

// 5. Cập nhật quyền
export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Lấy ID từ URL (:id)
    const { id } = req.params; 
    
    // 2. Lấy Role từ Body gửi lên
    const { role } = req.body;

    if (!role) throw new AppError("Vai trò không được để trống", 400);

    // 3. Gọi service để cập nhật (ép kiểu id sang số)
    const user = await userService.updateUserRole(Number(id), role);

    return res.json({ 
      success: true, 
      message: "Cập nhật vai trò thành công", 
      user 
    });
  } catch (error) {
    next(error);
  }
};


// 6. Lấy thông tin user hiện tại (Dùng cho Dashboard/Guard)
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Bạn chưa đăng nhập", 401);
    
    const decoded: any = verifyAccessToken(token);
    const result = await authService.validateUserSession(decoded.userId);

    return res.json({ 
      success: true, 
      user: {
        ...result.user,
        hasPassword: result.hasPassword 
      },
      needSetPassword: !result.hasPassword 
    });
  } catch (error) { next(error); }
};

/**
 * 7. Lấy danh sách người dùng (Dành cho Admin)
 * Sửa lỗi: Gọi đúng hàm getUsers() từ userService và kiểm tra quyền admin
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Bạn chưa đăng nhập", 401);

    const decoded: any = verifyAccessToken(token);
    
    if (decoded.role?.toLowerCase() !== 'admin') {
      throw new AppError("Bạn không có quyền xem danh sách này", 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const keyword = req.query.keyword as string;
    const role = req.query.role as string;

    // Gọi đúng hàm getUsers từ userService của bạn
    const result = await userService.getUsers(page, limit, keyword, role);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// 8. Đặt mật khẩu
export const setPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Bạn chưa đăng nhập", 401);
    const decoded: any = verifyAccessToken(token);
    await authService.updateUserPassword(decoded.userId, req.body.password);
    return res.json({ success: true, message: "Đặt mật khẩu thành công" });
  } catch (error) { next(error); }
};

// 9. Đăng xuất
export const logout = (req: Request, res: Response) => {
  return res.json({ success: true, message: "Đăng xuất thành công" });
};

export const getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Gọi service bạn đã viết trước đó
    const user = await userService.getUserById(Number(id));
    
    return res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId = Number(req.params.id);

    await deleteUserService(userId);

    return res.json({
      success: true,
      message: "Đã chuyển vào thùng rác"
    });

  } catch (error) {

    next(error);
  }
};

export const restoreUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId = Number(req.params.id);

    await restoreUserService(userId);

    return res.json({
      success: true,
      message: "Khôi phục thành công"
    });

  } catch (error) {

    next(error);
  }
};

export const permanentlyDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId = Number(req.params.id);

    await permanentlyDeleteUserService(userId);

    return res.json({
      success: true,
      message: "Đã xóa vĩnh viễn"
    });

  } catch (error) {

    next(error);
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId = Number(req.params.id);

    const user = await toggleUserStatusService(userId);

    return res.status(200).json({
      success: true,
      message:
        user.status === false
          ? "Đã khóa tài khoản"
          : "Đã mở tài khoản",
      user
    });

  } catch (error) {

    next(error);
  }
};
