import axios from "axios";

export const getAccessToken = async (code: string, state: string) => {
  console.log("[21] CALL TOKEN API");

  const data = {
    grant_type: "authorization_code",
    code: code,
    state: state,
    client_id: process.env.MEZON_CLIENT_ID,
    client_secret: process.env.MEZON_CLIENT_SECRET,
    redirect_uri: process.env.MEZON_REDIRECT_URI,
  };

  console.log("[22] PARAMS:", data);

  const response = await axios.post(
    "https://oauth2.mezon.ai/oauth2/token",
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  console.log("[23] TOKEN RESPONSE:", response.data);

  return response.data.access_token;
};

export const getUserInfo = async (accessToken: string) => {
  console.log("[24] CALL USERINFO API");

  const response = await axios.get("https://oauth2.mezon.ai/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[25] USERINFO RESPONSE:", response.data);
  return response.data;
};
