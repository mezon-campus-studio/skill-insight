import { Router, Request, Response } from 'express';
import pool from '../utils/database';
// Đảm bảo file types đã định nghĩa đúng hoặc tạm thời bỏ qua kiểm tra type nếu bị lỗi
import { User, ApiResponse } from '../types'; 

const router = Router();

// Trong backend/src/routes/user.routes.ts
router.get('/', async (req: Request, res: Response) => {
  try {
    // Thêm created_at vào câu lệnh SELECT
    const [rows] = await pool.query<any[]>(
      'SELECT user_id, full_name, email, role, created_at FROM users'
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Lỗi SQL:', error);
    res.status(500).json({ success: false, message: 'Lỗi truy vấn' });
  }
});
export default router;