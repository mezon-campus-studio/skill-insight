import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/appError';

dotenv.config();

const app: Application = express();

const corsOrigin = process.env.FRONTEND_URL || "http://localhost:4200";

app.use(
  cors({
    origin: corsOrigin, 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(cookieParser()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleTimeString();
  if (req.url.includes('/api/auth/me')) {
    console.log(`[${timestamp}] Request tới /me | Cookie nhận được:`, req.cookies);
    if (!req.cookies.token) {
      console.warn("CẢNH BÁO: Không tìm thấy cookie 'token' trong request gửi lên!");
    }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Không tìm thấy đường dẫn ${req.originalUrl} trên máy chủ này!`, 404));
});

app.use(errorHandler);

export default app;
