import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ======================
// VERIFY TOKEN
// ======================
export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    console.log("🔑 AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    console.log("👤 USER:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("❌ TOKEN ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ======================
// REQUIRE ROLE
// ======================
export const requireRole = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log("🔐 ROLE CHECK:", user?.role);

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient role",
      });
    }

    next();
  };
};