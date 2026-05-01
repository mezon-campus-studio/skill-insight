import axios from "axios";
import qs from "qs";
import { AppError } from "../utils/appError";

export const getAccessToken = async (code: string, state: string) => {
  try {
    if (!code) {
      throw new AppError("Code không hợp lệ", 400);
    }

    const data = qs.stringify({
      grant_type: "authorization_code",
      code: code,
      state: state,
      client_id: process.env.MEZON_CLIENT_ID,
      client_secret: process.env.MEZON_CLIENT_SECRET,
      redirect_uri: process.env.MEZON_REDIRECT_URI,
    });

    const response = await axios.post(
      "https://oauth2.mezon.ai/oauth2/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.data?.access_token) {
      throw new AppError("Không lấy được access token từ Mezon", 500);
    }

    return response.data.access_token;
  } catch (error: any) {
    console.error(" getAccessToken error:", error?.response?.data || error.message);

    throw new AppError(
      error?.response?.data?.error_description ||
      error?.message ||
      "Lỗi lấy access token",
      500
    );
  }
};

export const getUserInfo = async (accessToken: string) => {
  try {
    if (!accessToken) {
      throw new AppError("Access token không hợp lệ", 400);
    }

    const response = await axios.get(
      "https://oauth2.mezon.ai/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data) {
      throw new AppError("Không lấy được user info", 500);
    }

    return response.data;
  } catch (error: any) {
    console.error(" getUserInfo error:", error?.response?.data || error.message);

    throw new AppError(
      error?.response?.data?.error_description ||
      error?.message ||
      "Lỗi lấy thông tin user",
      500
    );
  }
};