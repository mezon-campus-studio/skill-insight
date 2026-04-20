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
    //console.log("[18] ACCESS TOKEN:", accessToken);
    if (!accessToken) {
      return res.status(401).json({ message: "Invalid access token" });
    }
    //Lấy thông tin user từ mezon
    const userInfo = await getUserInfo(accessToken);
    console.log("[20] USER INFO:", userInfo);
    const mezonUserId = userInfo.user_id;
    const email = userInfo.email;
    const name = userInfo.display_name;
    // Kiểm tra user đã tồn tại chưa(theo provider_id)
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE provider_id = ?",
      [mezonUserId],
    );
    let user;

    if (rows.length === 0) {
      //Nếu chưa có → tạo mới
      const [result]: any = await pool.query(
        `INSERT INTO users (full_name, email, password, role, provider_id)
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, null, "student", mezonUserId],
      );

      user = {
        user_id: result.insertId,
        full_name: name,
        email,
        role: "student",
        provider_id: mezonUserId,
      };
    } else {
      //Nếu có rồi → update
      user = rows[0];
      await pool.query(
        `UPDATE users 
         SET full_name = ?, email = ?
         WHERE provider_id = ?`,
        [name, email, mezonUserId],
      );
    }

    // 6. Tạo JWT
    const payload = {
      id: user.user_id,
      email: user.email,
      role: user.role,
    };

    const appToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    //Trả về client
    return res.json({
      user: payload,
      appToken,
    });
  } catch (error: any) {
    console.error("OAuth callback error:", error.message);
    return res.status(500).json({
      message: "Server error during OAuth callback",
    });
  }
};
