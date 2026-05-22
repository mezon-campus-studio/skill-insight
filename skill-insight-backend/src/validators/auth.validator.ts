import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email không đúng định dạng"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Email không đúng định dạng"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .refine((val) => passwordRegex.test(val), {
        message:
          "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      }),
    full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    userId: z.number(),
    role: z
      .string()
      .refine((val) => ["admin", "teacher", "student"].includes(val), {
        message: "Vai trò phải là admin, teacher hoặc student",
      }),
  }),
});
