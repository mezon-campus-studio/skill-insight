import * as userRepository from '../repositories/user.repositories';
import { AppError } from '../utils/appError';


export const getAllUsers = async () => {
  const users = await userRepository.findAll();
  return users;
};


export const getUserById = async (id: number) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new AppError('Không tìm thấy người dùng với ID này', 404);
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};


export const getUserProfile = async (id: number) => {
  return await getUserById(id);
};