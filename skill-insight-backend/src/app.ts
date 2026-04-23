import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================
// HEALTH CHECK
// ======================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
  });
});

// ======================
// ROOT TEST API
// ======================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Skill Insight Backend Running...',
  });
});

// ======================
// ROUTES
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ======================
// 404 HANDLE
// ======================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// ======================
// ERROR HANDLER
// ======================
app.use(errorHandler);

export default app;