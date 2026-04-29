import app from "./app";
import prisma from "./config/prisma";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    //Connect Prisma
    await prisma.$connect();
    console.log("Connected to MySQL (Prisma) successfully!");

    //Start server
    const server = app.listen(PORT, () => {
      console.log(`Server is running at: http://localhost:${PORT}`);
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
    // Handle system signals
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: any) => {
      console.error("CRITICAL ERROR:", err.message);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(1);
      });
    });
    // Handle uncaught exceptions (recommended)
    process.on("uncaughtException", (err: any) => {
      console.error("UNCAUGHT EXCEPTION:", err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Server startup error::", error);

    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
