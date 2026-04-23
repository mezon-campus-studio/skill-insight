import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  let server: any;

  try {
    // ======================
    // DATABASE CONNECTION
    // ======================
    await prisma.$connect();
    console.log("✅ Kết nối MySQL thành công!");

    // ======================
    // EXPRESS SERVER
    // ======================
    server = app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });

    // ======================
    // GRACEFUL SHUTDOWN
    // ======================
    const shutdown = async () => {
      console.log("🛑 Stopping server...");

      server.close(async () => {
        await prisma.$disconnect();
        console.log("✅ Prisma disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (error) {
    console.error("❌ Lỗi khởi động Server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }

  // ======================
  // UNHANDLED REJECTION
  // ======================
  process.on("unhandledRejection", (err: any) => {
    console.error("💥 Unhandled Rejection:", err.message);

    if (server) {
      server.close(() => process.exit(1));
    }
  });
}

startServer();