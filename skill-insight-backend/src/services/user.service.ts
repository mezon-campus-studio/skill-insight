import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ======================
// GET 1 USER
// ======================
export const getUserById = async (
  userId: number
) => {
  const user = await prisma.user.findUnique({
    where: {
      user_id: userId
    },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      provider_id: true,
      status: true,
      created_at: true,
      updated_at: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ======================
// REGISTER
// ======================
export const registerService = async (
  data: any
) => {
  const { email, password, full_name } = data;

  if (!email || !password || !full_name) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
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
      role: null,
      status: true
    },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      status: true,
      created_at: true
    }
  });

  return user;
};

// ======================
// LOGIN
// ======================
export const loginService = async (
  email: string,
  password: string
) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.status) {
    throw new Error("Account locked");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role || null
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }
  };
};

// ======================
// UPDATE ROLE
// ======================
export const updateUserRole = async (
  userId: number,
  role: string
) => {
  const allowedRoles: Role[] = [
    "student",
    "teacher",
    "admin"
  ];

  if (!allowedRoles.includes(role as Role)) {
    throw new Error("Invalid role");
  }

  const user = await prisma.user.findUnique({
    where: { user_id: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: userId },
    data: { role: role as Role }
  });

  const token = jwt.sign(
    {
      user_id: updatedUser.user_id,
      role: updatedUser.role
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      user_id: updatedUser.user_id,
      full_name: updatedUser.full_name,
      email: updatedUser.email,
      role: updatedUser.role
    }
  };
};

// ======================
// DELETE USER
// ======================
export const deleteUserService = async (
  userId: number
) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: { user_id: userId }
  });

  return {
    message: "Deleted successfully"
  };
};

// ======================
// GET USERS (SEARCH + PAGINATION) ✅ FIXED
// ======================
export const getUsersService = async (
  page: number,
  limit: number,
  keyword?: string
) => {
  const skip = (page - 1) * limit;

  // 🔥 xử lý keyword an toàn
  const keywordSafe = keyword?.trim() || "";

  console.log("🔍 KEYWORD:", keywordSafe);

  const where = keywordSafe
    ? {
        OR: [
          {
            email: {
              contains: keywordSafe
            }
          },
          {
            full_name: {
              contains: keywordSafe
            }
          }
        ]
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      user_id: "asc"
    },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      status: true,
      created_at: true
    }
  });

  const totalUsers = await prisma.user.count({
    where
  });

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      limit
    }
  };
};

// ======================
// ADMIN CREATE USER
// ======================
export const createUserByAdmin = async (data: any) => {
  const { email, password, full_name, role } = data;

  if (!email || !password || !full_name || !role) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      full_name,
      role: role as Role,
      status: true
    },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      created_at: true
    }
  });

  return newUser;
};