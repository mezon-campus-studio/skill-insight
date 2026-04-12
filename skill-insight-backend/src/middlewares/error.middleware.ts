import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 2. Detailed Error Logging for Developers
  console.error('------- START ERROR LOG -------');
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.error('Message:', err.message);
  if (err.stack) console.error('Stack:', err.stack);
  console.error('------- END ERROR LOG -------');

  // 3. Handle specific MySQL errors (Security & UX)
  if (err.code === 'ER_DUP_ENTRY') {
    err.statusCode = 400;
    err.message = 'Duplicate entry: This record already exists.';
  }
  if (err.code === 'ECONNREFUSED') {
    err.statusCode = 503;
    err.message = 'Database connection refused.';
  }

  // 4. Response to Client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};