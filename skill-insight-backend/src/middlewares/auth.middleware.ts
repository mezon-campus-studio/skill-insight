// import {
//   Request,
//   Response,
//   NextFunction
// } from "express";

// import jwt from "jsonwebtoken";

// import { AppError } from "../utils/appError";

// // const JWT_SECRET =
// //   process.env.JWT_SECRET || "secret";
//   const JWT_SECRET =
//     process.env.JWT_SECRET!;
    
// export interface AuthRequest extends Request {
//   user?: {
//     userId: number;
//     role: string;
//   };
// }

// export const verifyToken = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {

//   try {

//     const authHeader =
//       req.headers.authorization;

//     let token: string | undefined;

//     if (
//       authHeader &&
//       authHeader.startsWith("Bearer ")
//     ) {
//       token =
//         authHeader.split(" ")[1];
//     }

//     if (!token) {
//       token = req.cookies?.token;
//     }

//     if (!token) {
//       return next(
//         new AppError(
//           "Chưa đăng nhập",
//           401
//         )
//       );
//     }

//     const decoded =
//       jwt.verify(
//         token,
//         JWT_SECRET
//       ) as {
//         userId: number;
//         role: string;
//       };

//     req.user = decoded;

//     next();

//   } catch (error) {

//     next(
//       new AppError(
//         "Token không hợp lệ",
//         401
//       )
//     );
//   }
// };

// export const requireRole = (
//   ...roles: string[]
// ) => {

//   return (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
//   ) => {

//     if (!req.user) {
//       return next(
//         new AppError(
//           "Chưa đăng nhập",
//           401
//         )
//       );
//     }

//     const userRole =
//       req.user.role.toUpperCase();

//     const allowedRoles =
//       roles.map(role =>
//         role.toUpperCase()
//       );

//     if (
//       !allowedRoles.includes(userRole)
//     ) {
//       return next(
//         new AppError(
//           "Không có quyền truy cập",
//           403
//         )
//       );
//     }

//     next();
//   };
// };

// export const requireOwnership = (
//   getResource: (
//     req: Request
//   ) => Promise<any>
// ) => {

//   return async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
//   ) => {

//     try {

//       if (!req.user) {
//         return next(
//           new AppError(
//             "Chưa đăng nhập",
//             401
//           )
//         );
//       }

//       if (
//         req.user.role.toLowerCase()
//         === "admin"
//       ) {
//         return next();
//       }

//       const resource =
//         await getResource(req);

//       if (!resource) {
//         return next(
//           new AppError(
//             "Không tìm thấy dữ liệu",
//             404
//           )
//         );
//       }

//       if (
//         resource.teacher_id !==
//         req.user.userId
//       ) {
//         return next(
//           new AppError(
//             "Bạn không có quyền thao tác dữ liệu này",
//             403
//           )
//         );
//       }

//       next();

//     } catch (error) {

//       next(error);
//     }
//   };
// };


import {
  Request,
  Response,
  NextFunction
} from "express";

import jwt from "jsonwebtoken";

import { AppError } from "../utils/appError";

const JWT_SECRET = process.env.JWT_SECRET!;
    
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      token = req.cookies?.token;
    }

    if (!token) {
      return next(
        new AppError(
          "Chưa đăng nhập",
          401
        )
      );
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      ) as {
        userId: number;
        role: string;
      };

    req.user = decoded;
    next();

  } catch (error) {
    // 🔴 IN LỖI THỰC TẾ RA TERMINAL ĐỂ KIỂM TRA ĐĂNG NHẬP / PRISMA SẬP VÌ CÁI GÌ
    console.error("🔥 LỖI THỰC TẾ TẠI MIDDLEWARE AUTH:", error);

    next(
      new AppError(
        "Token không hợp lệ hoặc lỗi xử lý hệ thống",
        401
      )
    );
  }
};

export const requireRole = (
  ...roles: string[]
) => {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {
      return next(
        new AppError(
          "Chưa đăng nhập",
          401
        )
      );
    }

    const userRole =
      req.user.role.toUpperCase();

    const allowedRoles =
      roles.map(role =>
        role.toUpperCase()
      );

    if (
      !allowedRoles.includes(userRole)
    ) {
      return next(
        new AppError(
          "Không có quyền truy cập",
          403
        )
      );
    }

    next();
  };
};

export const requireOwnership = (
  getResource: (
    req: Request
  ) => Promise<any>
) => {

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      if (!req.user) {
        return next(
          new AppError(
            "Chưa đăng nhập",
            401
          )
        );
      }

      if (
        req.user.role.toLowerCase()
        === "admin"
      ) {
        return next();
      }

      const resource =
        await getResource(req);

      if (!resource) {
        return next(
          new AppError(
            "Không tìm thấy dữ liệu",
            404
          )
        );
      }

      if (
        resource.teacher_id !==
        req.user.userId
      ) {
        return next(
          new AppError(
            "Bạn không có quyền thao tác dữ liệu này",
            403
          )
        );
      }

      next();

    } catch (error) {
      next(error);
    }
  };
};
