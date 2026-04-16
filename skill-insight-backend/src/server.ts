import app from "./app";
import { pool } from "./config/database";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import authRoute from "./routes/auth.routes";
dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/auth", authRoute);
async function startServer(): Promise<void> {
  try {
    // 1. MySQL
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release();

    // 2. Express Server
    const server = app.listen(PORT, () => {
      console.log(`Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    // 3. Graceful Shutdown
    process.on("unhandledRejection", (err: any) => {
      console.error("LỖI NGHIÊM TRỌNG (Unhandled Rejection):", err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Lỗi khởi động Server:", error);
    process.exit(1);
  }
}

startServer();
