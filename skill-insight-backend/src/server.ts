import "./types";
import dotenv from "dotenv";
import app from "./app";
// BƯỚC 1: Import instance prisma duy nhất từ file lib (Singleton)
import prisma from "./lib/prisma"; 

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  let server: any;

  try {
   
    await prisma.$connect();
    console.log("Kết nối MySQL thành công thông qua Prisma!");

    server = app.listen(PORT, () => {
      console.log(`Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    const shutdown = async () => {
      console.log("Stopping server...");

      if (server) {
        server.close(async () => {
          await prisma.$disconnect();
          console.log("Prisma disconnected.");
          process.exit(0);
        });
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (error) {
    console.error("Lỗi khởi động Server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }

  process.on("unhandledRejection", (err: any) => {
    console.error(" Unhandled Rejection:", err.message);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}
startServer();
