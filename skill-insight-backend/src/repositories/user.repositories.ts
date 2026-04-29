import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

export const findAll = async () => {
  return prisma.user.findMany();
};

export const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: { user_id: id },
  });
};

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const create = async (userData: Prisma.UserCreateInput) => {
  const user = await prisma.user.create({
    data: userData,
  });
  return user.user_id;
};
