import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const router = Router();

interface LoginBody {
  email?: string;
  password?: string;
}

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Vui lòng nhập đầy đủ email và mật khẩu." 
      });
    }

    const result = await AuthService.login(email, password);
    
    return res.status(200).json({
      message: "Đăng nhập thành công!",
      data: result
    });
  } catch (error: any) {

    next(error); 
  }
});

export default router;