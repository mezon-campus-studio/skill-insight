import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err: any, res: Response) => {
 
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 

  else {
    console.error(' CRITICAL ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Đã có lỗi xảy ra từ phía hệ thống!'
    });
  }
};

const handlePrismaDuplicateFields = (err: any) => {
  const field = err.meta?.target || 'dữ liệu';
  const message = `Giá trị của ${field} đã tồn tại. Vui lòng sử dụng giá trị khác!`;
  return new AppError(message, 400);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('------- START ERROR LOG -------');
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.error('Message:', err.message);
  console.error('------- END ERROR LOG -------');

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 'P2002') error = handlePrismaDuplicateFields(error);
    if (err.name === 'JsonWebTokenError') error = new AppError('Mã xác thực không hợp lệ!', 401);
    if (err.name === 'TokenExpiredError') error = new AppError('Phiên đăng nhập đã hết hạn!', 401);

    sendErrorProd(error, res);
  }
};
