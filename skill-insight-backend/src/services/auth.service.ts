import { User } from "@prisma/client";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";
import { getAccessToken, getUserInfo } from "./mezon.service";
import { saveState, verifyState } from "../utils/stateStore";
interface AuthPayload {
  userId: number;
  email: string;
  role: string;
  mezonId?: string | null;
}

const buildAuthResponse = (user: User) => {
  const payload: AuthPayload = {
    userId: user.user_id,
    email: user.email,
    role: user.role,
    mezonId: user.provider_id,
  };

  const token = generateToken(payload);

  return { user: payload, token };
};

export const authService = {
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
            role: "student",
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
};
