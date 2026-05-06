import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repositories";
import { getAccessToken, getUserInfo } from "./mezon.service";
import { AppError } from "../utils/appError";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { saveState, verifyState } from "../utils/stateStore";
import { prisma } from "../lib/prisma";

interface AuthPayload {
  userId: number;
  email: string;
  role: string;
  mezonId?: string | null;
}

const buildAuthResponse = (user: any) => {
  const payload: AuthPayload = {
    userId: user.user_id,
    email: user.email,
    role: user.role,
    mezonId: user.provider_id,
  };

  return {
    user: {
      ...payload,
      hasPassword: !!user.password,
    },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const authService = {
  // ===== LOGIN thường =====
  async login(email: string, pass: string) {
    if (!email || !pass) {
      throw new AppError("Thiếu email hoặc password", 400);
    }

    const user = await userRepository.findAuthUserByEmail(
      email.trim().toLowerCase(),
    );

    if (!user || !user.password) {
      throw new AppError("Thông tin đăng nhập không chính xác", 401);
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new AppError("Thông tin đăng nhập không chính xác", 401);
    }
    return buildAuthResponse(user);
  },

  // ===== LOGIN MEZON =====
  handleMezonLogin: async (code: string, state: string) => {
    if (!verifyState(state)) {
      throw new Error("Invalid state");
    }
    if (!code) throw new Error("Missing code");
    const accessToken = await getAccessToken(code, state);

    if (!accessToken) {
      throw new Error("Invalid access token");
    }

    const userInfo = await getUserInfo(accessToken);

    const mezonUserId = userInfo.user_id;
    const email = userInfo.email;
    const name = userInfo.display_name;

    let user = await prisma.user.findFirst({
      where: { provider_id: mezonUserId },
    });

    if (!user) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        user = await prisma.user.update({
          where: { email },
          data: {
            provider_id: mezonUserId,
            full_name: name,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            full_name: name,
            email,
            password: null,
            role: null,
            provider_id: mezonUserId,
          },
        });
      }
    } else {
      user = await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          full_name: name,
          email,
        },
      });
    }

    return buildAuthResponse(user);
  },

  // ===== GET AUTH URL =====
  getAuthUrl: async () => {
    const state = Math.random().toString(36).substring(2, 13);
    saveState(state);
    const params = new URLSearchParams({
      client_id: `${process.env.MEZON_CLIENT_ID}`,
      redirect_uri: `${process.env.MEZON_REDIRECT_URI}`,
      response_type: "code",
      scope: "openid offline",
      state: state,
    });
    return `${process.env.Oauth2_URL}?${params.toString()}`;
  },

  // ===== CHECK SESSION =====
  async validateUserSession(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("Phiên không hợp lệ", 401);
    }

    const { password, ...safeUser } = user as any;

    return {
      ...safeUser,
      hasPassword: !!password,
    };
  },
};
