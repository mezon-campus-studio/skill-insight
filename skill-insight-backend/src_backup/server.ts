// backend/src/server.ts
import app from './app';
import { pool } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối MySQL thành công!');
    
    // Giải phóng kết nối tạm thời này lại vào pool
    connection.release();

    // 2. Khởi động Express Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });

    // 3. Xử lý lỗi hệ thống chưa được bắt (Graceful Shutdown)
    process.on('unhandledRejection', (err: any) => {
      console.error('💥 LỖI NGHIÊM TRỌNG (Unhandled Rejection):', err.message);
      // Đóng server từ từ rồi mới tắt process
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('❌ Lỗi khởi động Server:', error);
    process.exit(1);
  }
}

startServer();