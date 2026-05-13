import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import subjectRoutes from "./routes/subject.routes";

import { errorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/appError";

dotenv.config();

const app: Application = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:3000"],
      },
    },
  }),
);

// CORS config
const corsOrigin = process.env.FRONTEND_URL || "http://localhost:4200";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug cookie (giữ nếu đang test auth)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url.includes("/api/auth/me")) {
    console.log("Cookie nhận được:", req.cookies);
    if (!req.cookies.accessToken) {
      console.warn("Không có cookie 'token'!");
    }
  }
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);

// 404 handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `Không tìm thấy đường dẫn ${req.originalUrl} trên máy chủ này!`,
      404,
    ),
  );
});

// Global error handler
app.use(errorHandler);

export default app;
