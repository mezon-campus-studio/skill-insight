import { getAccessToken, getUserInfo } from "../services/mezon.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";
export const mezonCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Missing code" });
    }
    // Lấy access token từ mezon
    const accessToken = await getAccessToken(code, state);
    console.log("[18] ACCESS TOKEN:", accessToken);
    if (!accessToken) {
      return res.status(401).json({ message: "Invalid access token" });
    }
    // // Lấy thông tin user từ mezon
    // const userInfo = await getUserInfo(accessToken);
    // console.log("[20] USER INFO:", userInfo);
    // const mezonUserId = userInfo.id;
    // const email = userInfo.email;
    // const name = userInfo.name;
    // const mezon_id=userInfo.mezon_id;
    // // Tìm user trong DB bằng mezonId
    // const [rows] = await pool.query("SELECT * FROM users WHERE mezon_id = ?", [
    //   mezonUserId,
    // ]);
    // let user: any = (rows as any)[0];

    // if (!user) {
    //   // Nếu chưa có thì tạo mới
    //   const [result] = await pool.query(
    //     "INSERT INTO users (mezonId, email, name, phone, role) VALUES (?, ?, ?, ?, ?)",
    //     [mezonUserId, email, name, phone, "user"],
    //   );
    //   user = {
    //     id: (result as any).insertId,
    //     mezonId: mezonUserId,
    //     email,
    //     name,
    //     phone,
    //     role: "user",
    //   };
    // } else {
    //   // Nếu có rồi thì cập nhật thông tin cơ bản
    //   await pool.query(
    //     "UPDATE users SET email = ?, name = ?, phone = ? WHERE mezonId = ?",
    //     [email, name, phone, mezonUserId],
    //   );
    // }

    // // Sinh appToken (JWT)
    // const payload = {
    //   id: user.id,
    //   mezonId: user.mezonId,
    //   email: user.email,
    //   role: user.role,
    // };

    // const appToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    //   expiresIn: "1h",
    // });

    // Trả về cho client
    // return res.json({
    //   user: payload,
    //   appToken,
    // });
  } catch (error: any) {
    // console.error(
    //   "OAuth callback error:",
    //   error.response?.data || error.message,
    // );
    // return res
    //   .status(500)
    //   .json({ message: "Server error during OAuth callback" });
  }
};
