import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { AppError } from "./appError";

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET as string;

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

export interface TokenPayload {
  userId: number;
  email?: string;
  role?: string;
  mezonId?: string | null;
}

// ===== Generate =====
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as any,
  });
};

// ===== Verify =====
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // return {
    //   userId: decoded.userId as number,
    //   email: decoded.email as string,
    //   mezonId: decoded.mezonId as string | null,
    // };
    return decoded;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Access token hết hạn", 401);
    }
    throw new AppError("Access token không hợp lệ", 401);
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;

    return {
      userId: decoded.userId as number,
      email: decoded.email as string,
      mezonId: decoded.mezonId as string | null,
    };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Refresh token hết hạn", 401);
    }
    throw new AppError("Refresh token không hợp lệ", 401);
  }
};
