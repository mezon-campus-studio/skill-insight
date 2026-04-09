import app from './app';
import pool from './utils/database';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Thử thực hiện một truy vấn đơn giản để kiểm tra kết nối
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Kết nối MySQL thành công!');

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Lỗi kết nối MySQL:', error);
    process.exit(1);
  }
}

startServer();