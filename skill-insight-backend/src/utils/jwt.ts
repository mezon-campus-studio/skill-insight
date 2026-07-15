import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { AppError } from "./appError";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your_default_access_secret_123";
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "your_default_refresh_secret_456";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface TokenPayload {
  userId: number;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return generateAccessToken(payload);
};

export const verifyToken = (token: string): TokenPayload => {
  return verifyAccessToken(token);
};

export const generateAccessToken = (payload: TokenPayload): string => {
  // TypeScript sẽ không còn báo lỗi vì JWT_SECRET đã chắc chắn là string
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    return {
      userId: decoded.userId as number,
      role: decoded.role as string,
    };
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
      role: decoded.role as string,
    };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Refresh token hết hạn", 401);
    }
    throw new AppError("Refresh token không hợp lệ", 401);
  }
};
