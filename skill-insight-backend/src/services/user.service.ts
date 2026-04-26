import * as userRepository from "../repositories/user.repositories";
import { AppError } from "../utils/appError";

interface User {
  user_id?: number;
  full_name?: string | null;
  email: string;
  password?: string | null;
  role?: string;
  provider_id?: string | null;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export const getAllUsers = async (): Promise<User[]> => {
  const users = await userRepository.findAll();
  return users;
};

export const getUserById = async (
  id: number,
): Promise<Omit<User, "password">> => {
  if (!id || isNaN(id) || id <= 0) {
    throw new AppError("Invalid ID", 400);
  }
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError("User not found with this ID", 404);
  }
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserProfile = async (
  id: number,
): Promise<Omit<User, "password">> => {
  return await getUserById(id);
};
