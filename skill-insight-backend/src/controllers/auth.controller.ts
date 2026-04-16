import { getAccessToken, getUserInfo } from "../services/mezon.service";
import { Request, Response } from "express";
export const mezonCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    console.log("CODE từ FE:", code);

    if (!code) {
      return res.status(400).json({ message: "Missing code" });
    }

    const accessToken = await getAccessToken(code);
    console.log("ACCESS TOKEN:", accessToken);

    const userInfo = await getUserInfo(accessToken);
    console.log("USER:", userInfo);

    return res.json({
      user: userInfo,
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
