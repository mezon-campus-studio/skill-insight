import * as userRepository from "../repositories/user.repositories";
import { AppError } from "../utils/appError";

interface User {
  user_id?: number;
  full_name?: string | null;
  email: string;
  password?: string | null;
  role?: string;
  created_at?: Date;
}

export const getAllUsers = async (): Promise<User[]> => {
  const users = await userRepository.findAll();
  return users;
};

export const getUserById = async (
  id: number,
): Promise<Omit<User, "password">> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError("Không tìm thấy người dùng với ID này", 404);
  }
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserProfile = async (
  id: number,
): Promise<Omit<User, "password">> => {
  return await getUserById(id);
};
