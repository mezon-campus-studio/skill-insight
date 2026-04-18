import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

//Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "http://localhost:3000"],
      },
    },
  }),
);

//CORS config
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

//Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Health Check
app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

//Routes
app.use("/api/users", userRoutes);
app.use("/auth", authRoute);
app.use(cors());
app.use(express.json());
// Error Middleware
app.use(errorHandler);

export default app;
