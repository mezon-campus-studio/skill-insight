import app from "./app";
import { prisma } from "./config/prisma";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    //Connect Prisma
    await prisma.$connect();
    console.log("Kết nối MySQL (Prisma) thành công!");

    //Start server
    const server = app.listen(PORT, () => {
      console.log(`Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    //Graceful shutdown
    const shutdown = async () => {
      console.log("Stopping server...");
      server.close(async () => {
        await prisma.$disconnect();
        console.log("Disconnected Prisma.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    //lỗi async không catch
    process.on("unhandledRejection", (err: any) => {
      console.error("LỖI NGHIÊM TRỌNG:", err.message);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Lỗi khởi động Server:", error);

    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
