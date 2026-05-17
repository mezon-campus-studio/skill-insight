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
