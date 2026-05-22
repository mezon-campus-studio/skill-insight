<<<<<<< HEAD
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
=======
import dotenv from "dotenv";
import app from "./app";
import prisma from "./lib/prisma";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  let server: any;

  try {
    // Connect Prisma
    await prisma.$connect();
    console.log("Connected to MySQL (Prisma) successfully!");

    // Start server
    server = app.listen(PORT, () => {
      console.log(`Server is running at: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("Stopping server...");
      if (server) {
        server.close(async () => {
          await prisma.$disconnect();
          console.log("Disconnected Prisma.");
          process.exit(0);
        });
      }
    };

    // Signals
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    // Unhandled rejection
    process.on("unhandledRejection", (err: any) => {
      console.error("CRITICAL ERROR:", err.message);
      if (server) {
        server.close(async () => {
          await prisma.$disconnect();
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    // Uncaught exception
    process.on("uncaughtException", (err: any) => {
      console.error("UNCAUGHT EXCEPTION:", err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
>>>>>>> 7831c51b0f00e6b70f4c2d7230e7bc7f04f9e0b5
