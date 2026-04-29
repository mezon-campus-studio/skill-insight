import axios from "axios";

export const getAccessToken = async (code: string, state: string) => {
  const data = {
    grant_type: "authorization_code",
    code: code,
    state: state,
    client_id: process.env.MEZON_CLIENT_ID,
    client_secret: process.env.MEZON_CLIENT_SECRET,
    redirect_uri: process.env.MEZON_REDIRECT_URI,
  };

  const response = await axios.post(`${process.env.Token_URL}`, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data.access_token;
};

export const getUserInfo = async (accessToken: string) => {
  const response = await axios.get(`${process.env.User_URL}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
