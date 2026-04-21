import prisma from "../config/prisma";

export const findAll = async () => {
  return await prisma.user.findMany();
};

export const findById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { user_id: id },
  });
};

export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const create = async (userData: any) => {
  const user = await prisma.user.create({
    data: userData,
  });
  return user.user_id;
};
