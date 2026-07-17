import bcrypt from "bcrypt";
import { getAccessToken, getUserInfo } from "./mezon.service";
import { AppError } from "../utils/appError";
import { userRepository } from "../repositories/user.repositories";

export const authService = {

  // 1. Đăng nhập truyền thống
  async login(email: string, pass: string) {
    if (!email || !pass) {
      throw new AppError("Thiếu email hoặc password", 400);
    }

    const user = await userRepository.findAuthUserByEmail(email.trim().toLowerCase());

    if (!user || !user.password) {
      throw new AppError("Thông tin đăng nhập không chính xác", 401);
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new AppError("Thông tin đăng nhập không chính xác", 401);
    }

    const { password, ...safeUser } = user;
    return { ...safeUser, hasPassword: true };
  },

  // 2. Xử lý logic Login Mezon (Bước 4, 5 flow Mentor)
  async handleMezonLogin(code: string, state: string) {
    try {
      if (!code) throw new AppError("Mã xác thực Mezon không hợp lệ", 400);

      const accessToken = await getAccessToken(code, state);
      const userInfo = await getUserInfo(accessToken);

      const email = userInfo.email;
      const mezonId = userInfo.user_id;

      if (!email) throw new AppError("Không thể truy cập email từ tài khoản Mezon", 400);

      const emailClean = email.trim().toLowerCase();
      const defaultName = userInfo.display_name || userInfo.username || email.split("@")[0];

      let user = await userRepository.findAuthUserByEmail(emailClean);

      if (!user) {
        user = await userRepository.create({
          email: emailClean,
          full_name: defaultName,
          provider_id: String(mezonId),
          role: null 
        }) as any;
      } else {
        if (!user.provider_id) {
          user = await userRepository.update(user.user_id, {
            provider_id: String(mezonId)
          }) as any;
        }
      }

      if (!user) throw new AppError("Lỗi đồng bộ dữ liệu người dùng", 500);

      const hasPassword = !!user.password; 
      const needSetPassword = !hasPassword;

      const { password, ...safeUser } = user as any;

      // Trả về object chứa user lồng bên trong để khớp với Controller
      return {
        user: { ...safeUser, hasPassword },
        needSetPassword
      };

    } catch (error: any) {
      console.error(" [AUTH SERVICE ERROR]:", error.message);
      if (error instanceof AppError) throw error;
      throw new AppError(error?.message || "Xác thực Mezon thất bại", 500);
    }
  },

  // 3. Kiểm tra phiên làm việc (Dùng cho hàm getMe)
 // skill-insight-backend/src/services/auth.service.ts
async validateUserSession(userId: number) {
  // Lấy user an toàn để trả về FE
  const userSafe = await userRepository.findById(userId);
  // Lấy user đầy đủ để check password
  const userFull = await userRepository.findAuthUserByEmail(userSafe?.email || '');

  if (!userSafe) throw new AppError("Phiên làm việc không hợp lệ", 401);

  return {
    user: userSafe,
    hasPassword: !!userFull?.password // Trả về true nếu có pass, false nếu null (Mezon)
  };
},

  // 4. Cập nhật mật khẩu (Hàm còn thiếu khiến Controller báo lỗi)
  async updateUserPassword(userId: number, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return await userRepository.update(userId, {
      password: hashedPassword,
      skip_set_password: true
    });
  },

   async skipSetPassword(userId: number) {
    return await userRepository.skipSetPassword(userId);
  }

};

