import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

// ===== Safe select (không trả password) =====
const userSafeSelect = Prisma.validator<Prisma.UserSelect>()({
  user_id: true,
  full_name: true,
  email: true,
  role: true,
  provider_id: true,
  created_at: true,
});

// ===== Repository =====
export const userRepository = {
  // ===== FIND =====
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: userSafeSelect,
    });
  },

  async findAuthUserByEmail(email: string) {
    // dùng cho login → cần password
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { user_id: id },
      select: userSafeSelect,
    });
  },

  async findAll() {
    return prisma.user.findMany({
      select: userSafeSelect,
    });
  },

  // ===== CREATE =====
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: userSafeSelect,
    });
  },

  // ===== UPDATE =====
  async update(userId: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { user_id: userId },
      data,
      select: userSafeSelect,
    });
  },

  // ===== DELETE =====
  async delete(userId: number) {
    return prisma.user.delete({
      where: { user_id: userId },
    });
  },

  // ===== UTIL =====
  async isEmailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { user_id: true },
    });
    return !!user;
  },
};
