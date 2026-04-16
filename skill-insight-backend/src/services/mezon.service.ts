import axios from "axios";

export const getAccessToken = async (code: string) => {
  const params = new URLSearchParams();
  console.log("CLIENT_ID:", process.env.MEZON_CLIENT_ID);
  console.log("CLIENT_SECRET:", process.env.MEZON_CLIENT_SECRET);
  console.log("REDIRECT:", process.env.MEZON_REDIRECT_URI);
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.MEZON_CLIENT_ID!);
  params.append("client_secret", process.env.MEZON_CLIENT_SECRET!);
  params.append("redirect_uri", process.env.MEZON_REDIRECT_URI!);
  params.append("code", code);
  console.log("PARAMS:", params.toString());
  const response = await axios.post(
    "https://oauth2.mezon.ai/oauth2/token",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data.access_token;
};

export const getUserInfo = async (accessToken: string) => {
  const response = await axios.get("https://oauth2.mezon.ai/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
