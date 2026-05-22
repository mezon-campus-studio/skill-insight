<<<<<<< HEAD

// import { Request, Response, NextFunction } from "express";
// import crypto from "crypto";
// import { authService } from "../services/auth.service";
// import { userService } from "../services/user.service"; // Đảm bảo có import này
// import { generateToken, verifyToken } from "../utils/jwt";
// import { AppError } from "../utils/appError";

// const cookieOptions = {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax" as const, 
//   path: "/",
//   maxAge: 5 * 60 * 1000 
// };

// const extractToken = (req: Request): string | null => {
//   const authHeader = req.headers.authorization;
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     return authHeader.split(" ")[1];
//   }
//   return null;
// };

// // 1. Lấy URL đăng nhập Mezon
// export const getMezonUrl = async (req: Request, res: Response) => {
//   try {
//     const state = crypto.randomBytes(8).toString("hex");
//     res.cookie("oauth_state", state, cookieOptions);

//     const params = new URLSearchParams({
//       client_id: process.env.MEZON_CLIENT_ID || "",
//       redirect_uri: process.env.MEZON_REDIRECT_URI || "",
//       response_type: "code",
//       scope: "openid offline",
//       state
//     });

//     return res.json({
//       success: true,
//       url: `https://oauth2.mezon.ai/oauth2/auth?${params.toString()}`
//     }); 

//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Lỗi kết nối Mezon" });
//   }
// };

// // 2. Mezon Callback
// export const mezonCallback = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { code, state } = req.query;
//     const savedState = req.cookies?.oauth_state;

//     // 1. Kiểm tra state (Nếu chạy local hay bị lỗi cookie state, bạn có thể tạm comment dòng if này)
//     if (!code || !state || state !== savedState) {
//       console.error("--- [LỖI] STATE KHÔNG KHỚP ---");
//       // return res.redirect(`http://localhost:4200/login?error=invalid_state`);
//     }

//     // 2. PHẢI CÓ BƯỚC NÀY: Gọi service để đổi code lấy thông tin user
//     // Hàm này sẽ tự động lấy accessToken -> lấy userInfo -> lưu DB
//     const { user, needSetPassword } = await authService.handleMezonLogin(code as string, state as string);

//     // 3. Tạo Token JWT
//     const token = generateToken({ 
//       userId: user.user_id, 
//       role: (user.role as string) || 'student' 
//     });

//     console.log("--- [SUCCESS] ĐÃ TẠO TOKEN:", token);

//     res.clearCookie("oauth_state");

//     // 4. CHỖ QUAN TRỌNG NHẤT: Redirect kèm token
//     const finalUrl = `http://localhost:4200/callback?token=${encodeURIComponent(token)}&needSetPassword=${needSetPassword}`;
//     console.log("--- [REDIRECTING] --->", finalUrl);

//     return res.redirect(finalUrl);

//   } catch (error: any) {
//     console.error("--- [LỖI CALLBACK BACKEND]:", error.message);
//     // Nếu lỗi, phải redirect về login kèm mã lỗi để FE biết
//     return res.redirect(`http://localhost:4200/login?error=auth_failed`);
//   }
// };


// // 3. Đăng nhập truyền thống
// export const login = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body;
//     const result = await authService.login(email, password);
//     const token = generateToken({ userId: result.user_id, role: (result.role as string) || 'student' });

//     return res.json({ success: true, user: result, token });
//   } catch (error) {
//     next(error);
//   }
// };

// // 4. Đăng ký tài khoản (HÀM BỊ THIẾU ĐÃ THÊM LẠI)
// export const register = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await userService.register(req.body);
//     const token = generateToken({ userId: user.user_id, role: (user.role as string) || 'student' });

//     return res.status(201).json({ success: true, message: "Đăng ký thành công", user, token });
//   } catch (error) {
//     next(error);
//   }
// };

// // 5. Cập nhật quyền (HÀM BỊ THIẾU ĐÃ THÊM LẠI)
// export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { userId, role } = req.body;
//     const user = await userService.updateUserRole(userId, role);
//     return res.json({ success: true, message: "Cập nhật vai trò thành công", user });
//   } catch (error) {
//     next(error);
//   }
// };

// // 6. Lấy thông tin user hiện tại
// export const getMe = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = extractToken(req);
//     if (!token) throw new AppError("Bạn chưa đăng nhập", 401);
    
//     const decoded: any = verifyToken(token);
//     const result = await authService.validateUserSession(decoded.userId);

//     // result lúc này có: { user, hasPassword }
//     return res.json({ 
//       success: true, 
//       user: {
//         ...result.user,
//         // Lấy đúng tên biến hasPassword từ result
//         hasPassword: result.hasPassword 
//       },
//       // needSetPassword cho FE sẽ ngược lại với hasPassword
//       needSetPassword: !result.hasPassword 
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = extractToken(req);
//     if (!token) throw new AppError("Bạn chưa đăng nhập", 401);

//     const decoded: any = verifyToken(token);
    
//     // Bảo mật: Chỉ Admin mới được phép vào đây
//     if (decoded.role?.toLowerCase() !== 'admin') {
//       throw new AppError("Bạn không có quyền xem danh sách này", 403);
//     }

//     // Lấy các tham số lọc từ URL (Frontend gửi lên)
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const keyword = req.query.keyword as string;
//     const role = req.query.role as string;

//     // Gọi tới cái userService xịn mà bạn vừa gửi cho mình
//     const result = await userService.getUsers(page, limit, keyword, role);

//     return res.json({
//       success: true,
//       ...result
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // 7. Đặt mật khẩu
// export const setPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = extractToken(req);
//     if (!token) throw new AppError("Bạn chưa đăng nhập", 401);
//     const decoded: any = verifyToken(token);
//     await authService.updateUserPassword(decoded.userId, req.body.password);
//     return res.json({ success: true, message: "Đặt mật khẩu thành công" });
//   } catch (error) {
//     next(error);
//   }
// };

// // 8. Đăng xuất
// export const logout = (req: Request, res: Response) => {
//   return res.json({ success: true, message: "Đăng xuất thành công" });
// };


import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { generateToken, verifyToken } from "../utils/jwt";
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

    const token = generateToken({ 
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
    const token = generateToken({ userId: result.user_id, role: (result.role as string) || 'student' });
    return res.json({ success: true, user: result, token });
  } catch (error) { next(error); }
};

// 4. Đăng ký tài khoản
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.register(req.body);
    const token = generateToken({ userId: user.user_id, role: (user.role as string) || 'student' });
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
    
    const decoded: any = verifyToken(token);
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

    const decoded: any = verifyToken(token);
    
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
    const decoded: any = verifyToken(token);
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
=======
import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../utils/jwt";
import { AppError } from "../utils/appError";

//Cookie config
const cookieOptions = {
  httpOnly: true,
  secure: false,
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

//Extract token
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.cookies?.accessToken || null;
};

//OAuth callback
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
//URL OAuth
export const getMezonUrl = async (res: Response) => {
  try {
    const url = await authService.getAuthUrl();
    return res.json({ success: true, url });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi tạo URL OAuth" });
  }
};
//Login
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

//Register
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

//Get current user
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

//Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ success: true });
};

//Update role
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
    // TẠO TOKEN MỚI
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
    // SET COOKIE MỚI
    res.cookie("accessToken", accessToken, accessTokenCookie);

    res.cookie("refreshToken", refreshToken, refreshTokenCookie);
    return res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

//Set password
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
>>>>>>> 7831c51b0f00e6b70f4c2d7230e7bc7f04f9e0b5
