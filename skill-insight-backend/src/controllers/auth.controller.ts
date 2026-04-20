import { getAccessToken, getUserInfo } from "../services/mezon.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export const mezonCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Missing code" });
    }

    // take access token
    const accessToken = await getAccessToken(code, state);

    if (!accessToken) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    // take user info
    const userInfo = await getUserInfo(accessToken);
    const mezonUserId = userInfo.user_id;
    const email = userInfo.email;
    const name = userInfo.display_name;

    //find user by provider_id (Mezon)
    let user = await prisma.user.findFirst({
      where: { provider_id: mezonUserId },
    });

    //check account does not exist
    if (!user) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        //account already exists
        user = await prisma.user.update({
          where: { email },
          data: {
            provider_id: mezonUserId,
            full_name: name,
          },
        });
      } else {
        //create new
        user = await prisma.user.create({
          data: {
            full_name: name,
            email,
            password: null,
            role: "student",
            provider_id: mezonUserId,
          },
        });
      }
    } else {
      //update info
      user = await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          full_name: name,
          email,
        },
      });
    }

    //create JWT
    const payload = {
      id: user.user_id,
      email: user.email,
      role: user.role,
    };

    const appToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    //responce client
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
