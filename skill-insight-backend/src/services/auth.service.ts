import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ======================
// REGISTER
// ======================
export const registerService = async (data: any) => {
  const { email, password, full_name } = data;

  if (!email || !password || !full_name) {
    throw new Error("Thiếu thông tin");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      full_name,
      role: null,
    },
  });

  return user;
};

// ======================
// LOGIN
// ======================
export const loginService = async (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Thiếu email hoặc mật khẩu");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Không tìm thấy user");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Sai mật khẩu");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
    },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user,
  };
};