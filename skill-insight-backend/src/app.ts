
// import express, {
//   Application,
//   Request,
//   Response,
//   NextFunction
// } from 'express';

// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';

// import authRoutes from './routes/auth.routes';
// import userRoutes from './routes/user.routes';

// import classRoutes from './routes/class.routes';
// import examRoutes from './routes/exam.routes';
// import submissionRoutes from './routes/submission.routes';

// import { errorHandler } from './middlewares/error.middleware';
// import { AppError } from './utils/appError';

// dotenv.config();

// const app: Application = express();

// const corsOrigin =
//   process.env.FRONTEND_URL ||
//   "http://localhost:4200";

// app.use(
//   cors({
//     origin: corsOrigin,
//     credentials: true,
//     methods: [
//       "GET",
//       "POST",
//       "PUT",
//       "DELETE",
//       "OPTIONS"
//     ],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "X-Requested-With",
//       "Accept"
//     ],
//   })
// );

// app.use(cookieParser());

// app.use(express.json());

// app.use(express.urlencoded({
//   extended: true
// }));

// // DEBUG COOKIE
// app.use((
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {

//   const timestamp =
//     new Date().toLocaleTimeString();

//   if (req.url.includes('/api/auth/me')) {

//     console.log(
//       `[${timestamp}] Request tới /me`
//     );

//     console.log(
//       'Cookie:',
//       req.cookies
//     );

//     if (!req.cookies.token) {

//       console.warn(
//         "Không tìm thấy cookie token!"
//       );

//     }

//   }

//   next();

// });

// // ROUTES
// app.use('/api/auth', authRoutes);

// app.use('/api/users', userRoutes);

// app.use('/api/classes', classRoutes);

// app.use('/api/exams', examRoutes);

// app.use('/api/submissions', submissionRoutes);

// // HEALTH CHECK
// app.get('/health', (
//   req: Request,
//   res: Response
// ) => {

//   res.status(200).json({
//     success: true,
//     message: 'Server is healthy',
//     timestamp: new Date().toISOString()
//   });

// });

// // 404
// app.all('*', (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {

//   next(
//     new AppError(
//       `Không tìm thấy đường dẫn ${req.originalUrl} trên máy chủ này!`,
//       404
//     )
//   );

// });

// // ERROR HANDLER
// app.use(errorHandler);

// export default app;


import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// =========================
// ROUTES
// =========================
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import classRoutes from "./routes/class.routes";
import examRoutes from "./routes/exam.routes";
import submissionRoutes from "./routes/submission.routes";
import resultRoutes from "./routes/result.routes";
import subjectRoutes from "./routes/subject.routes";
import topicRoutes from "./routes/topic.routes";
import questionRoutes from "./routes/question.routes";
import questionBatchRoutes from "./routes/questionBatch.routes";

import { errorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/appError";

dotenv.config();

const app: Application = express();

const corsOrigin =
  process.env.FRONTEND_URL ||
  "http://localhost:4200";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/question-batches", questionBatchRoutes);

app.use(
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const timestamp =
      new Date().toLocaleTimeString();

    if (
      req.url.includes("/api/auth/me")
    ) {

      console.log(
        `[${timestamp}] Request tới /api/auth/me`
      );

      console.log(
        "Cookie:",
        req.cookies
      );

      if (!req.cookies.token) {

        console.warn(
          "⚠ Không tìm thấy cookie token!"
        );

      }

    }

    next();

  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/classes",
  classRoutes
);

app.use(
  "/api/exams",
  examRoutes
);

app.use(
  "/api/submissions",
  submissionRoutes
);

app.use(
  "/api/results",
  resultRoutes
);

app.use(
  "/api/subjects",
  subjectRoutes
);

app.use(
  "/api/topics",
  topicRoutes
);

app.use(
  "/api/questions",
  questionRoutes
);
app.get(
  "/",
  (
    req: Request,
    res: Response
  ) => {

    res.status(200).json({

      success: true,

      message:
        "Skill Insight Backend API đang hoạt động 🚀",

    });

  }
);

app.get(
  "/health",
  (
    req: Request,
    res: Response
  ) => {

    res.status(200).json({

      success: true,

      message:
        "Server is healthy",

      timestamp:
        new Date().toISOString(),

    });

  }
);

app.all(
  "*",
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    next(

      new AppError(

        `Không tìm thấy đường dẫn ${req.originalUrl} trên máy chủ này!`,

        404

      )

    );

  }
);

app.use(errorHandler);

export default app;
