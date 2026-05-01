import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/appError";
import prisma from "../lib/prisma"; // Sử dụng instance singleton

export const userService = {

  async login(email: string, pass: string) {
    if (!email || !pass) throw new AppError("Vui lòng nhập đầy đủ email và mật khẩu", 400);

    const user = await userRepository.findAuthUserByEmail(email.trim().toLowerCase());
    if (!user || !user.password) {
      throw new AppError("Thông tin đăng nhập không chính xác", 401);
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new AppError("Thông tin đăng nhập không chính xác", 401);
    }

    const { password, ...userWithoutPass } = user;
    return userWithoutPass;
  },

  async register(data: any) {
    const { email, password, full_name } = data;
    if (!email || !password || !full_name) throw new AppError("Thiếu thông tin đăng ký", 400);

    const isExists = await userRepository.isEmailExists(email);
    if (isExists) throw new AppError("Email này đã được sử dụng", 409);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.create({
      full_name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: null 
    });
  },

  async updateUserRole(userId: number, role: string) {
    const allowedRoles: string[] = ["student", "teacher", "admin"];
    if (!allowedRoles.includes(role)) {
      throw new AppError("Vai trò không hợp lệ", 400);
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    return await userRepository.update(userId, { 
      role: role as Role 
    });
  },

  async setUserPassword(userId: number, pass: string) {
    if (!pass) throw new AppError("Mật khẩu không được để trống", 400);
    const hashedPassword = await bcrypt.hash(pass, 10);
    return await userRepository.update(userId, { password: hashedPassword });
  },

  async getUserById(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);
    return user;
  },

  async deleteUser(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    await prisma.user.delete({ where: { user_id: userId } });
    return { message: "Xóa người dùng thành công" };
  },

  async getUsers(page: number, limit: number, keyword?: string) {
    const skip = (page - 1) * limit;

    const where = keyword?.trim()
      ? {
          OR: [
            { email: { contains: keyword, mode: "insensitive" as any } },
            { full_name: { contains: keyword, mode: "insensitive" as any } }
          ]
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { user_id: "asc" },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true
      }
    });

    const totalUsers = await prisma.user.count({ where });

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit
      }
    };
  },

  async createUserByAdmin(data: any) {
    const { email, password, full_name, role } = data;
    if (!email || !password || !full_name || !role) throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);

    const isExists = await userRepository.isEmailExists(email);
    if (isExists) throw new AppError("Email này đã được sử dụng", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      full_name,
      role: role as Role
    });
  }
};

export const loginService = userService.login;
export const registerService = userService.register;
export const getUserById = userService.getUserById;
export const updateUserRole = userService.updateUserRole;
export const deleteUserService = userService.deleteUser;
export const getUsersService = userService.getUsers;
export const createUserByAdmin = userService.createUserByAdmin;
export const setUserPassword = userService.setUserPassword;
