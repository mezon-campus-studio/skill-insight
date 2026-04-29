import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const mezonCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Missing code" });
    }
    if (!state) {
      return res.status(400).json({ message: "Invalid state" });
    }
    const result = await authService.handleMezonLogin(
      code as string,
      state as string,
    );

    return res.redirect(`${process.env.REDIRECT_URI}?token=${result.token}`);
  } catch (error: any) {
    console.error("OAuth callback error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const login = async (req: Request, res: Response) => {
  const url = await authService.getAuthUrl();
  return res.redirect(url);
};
