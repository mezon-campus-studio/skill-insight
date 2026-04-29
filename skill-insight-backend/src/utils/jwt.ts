import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  mezonId?: string | null;
}

export const generateToken = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
};
