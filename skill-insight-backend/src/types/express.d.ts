// src/types/express.d.ts

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: number;
      role: string;
    };
  }
}

export {};
