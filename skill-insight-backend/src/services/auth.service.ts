import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { getAccessToken, getUserInfo } from "./mezon.service";
import { AppError } from "../utils/appError";

export const authService = {

  async login(email: string, pass: string) {
    if (!email || !pass) {
      throw new AppError("Thiếu email hoặc password", 400);
    }

    const user = await userRepository.findAuthUserByEmail(
      email.trim().toLowerCase()
    );

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

  async getUserWithPassword(email: string) {
    return await userRepository.findAuthUserByEmail(
      email.trim().toLowerCase()
    );
  },

  async handleMezonLogin(code: string, state: string) {
    try {
      if (!code) throw new AppError("Mã xác thực Mezon không hợp lệ", 400);

      const accessToken = await getAccessToken(code, state);
      const userInfo = await getUserInfo(accessToken);

      const email = userInfo.email;
      const mezonId = userInfo.user_id;

      if (!email) throw new AppError("Không thể truy cập email từ tài khoản Mezon", 400);

      const defaultName = userInfo.display_name || userInfo.username || email.split("@")[0];

      let user = await userRepository.findAuthUserByEmail(email.trim().toLowerCase());

      if (!user) {

        user = await userRepository.create({
          email: email.trim().toLowerCase(),
          full_name: defaultName,
          provider_id: String(mezonId),
          role: null 
        }) as any;
      } else {
        
        if (!user.provider_id) {
          await userRepository.update(user.user_id, {
            provider_id: String(mezonId)
          });
        }
       
        user = await userRepository.findAuthUserByEmail(email);
      }

      if (!user) throw new AppError("Lỗi đồng bộ dữ liệu người dùng", 500);

      
      const hasPassword = !!user.password; 
      const needSetPassword = !hasPassword;

      const { password, ...safeUser } = user;

    
      return {
        user: { 
          ...safeUser, 
          hasPassword 
        },
        needSetPassword
      };

    } catch (error: any) {
      console.error(" [AUTH SERVICE ERROR]:", error.message);
      if (error instanceof AppError) throw error;
      throw new AppError(error?.message || "Xác thực Mezon thất bại", 500);
    }
  },

  async validateUserSession(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Phiên làm việc không hợp lệ", 401);
    
    const { password, ...safeUser } = user as any;
    return { ...safeUser, hasPassword: !!password };
  }
};
