import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    // 1. MySQL
    await prisma.$connect();
    console.log('✅ Kết nối MySQL thành công!');

    // 2. Express Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });

    // 3. Graceful Shutdown
    const shutdown = async () => {
      console.log('Stopping server...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Disconnected Prisma.');
        process.exit(0);
      });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    process.on('unhandledRejection', (err: any) => {
      console.error('💥 LỖI NGHIÊM TRỌNG:', err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('❌ Lỗi khởi động Server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
