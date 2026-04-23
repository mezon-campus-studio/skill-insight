import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ================= GET 1 USER =================
export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { user_id: id },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      provider_id: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ================= GET USERS =================
export const getUsersService = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: { user_id: "asc" },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      provider_id: true,
      status: true,
      created_at: true,
    },
  });

  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      limit,
    },
  };
};

// ================= REGISTER =================
export const registerService = async (data: any) => {
  const { email, password, full_name } = data;

  if (!email || !password || !full_name) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      full_name,
      email,
      password: hashedPassword,
      role: null 
    },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      provider_id: true,
      status: true,
      created_at: true,
    },
  });

  return user;
};

// ================= LOGIN =================
export const loginService = async (
  email: string,
  password: string
) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.status) {
    throw new Error("Account is locked");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role || null 
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

// ================= UPDATE ROLE =================
export const updateUserRole = async (
  userId: number,
  role: string
) => {
  const allowedRoles: Role[] = [
    "student",
    "teacher",
    "admin",
  ];

  if (!allowedRoles.includes(role as Role)) {
    throw new Error("Invalid role");
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: userId },
    data: {
      role: role as Role,
    },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
    },
  });

  return updatedUser;
};