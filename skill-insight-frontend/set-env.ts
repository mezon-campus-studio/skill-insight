import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: './.env' });

const envConfigFile = `export const environment = {
  BACKEND_API_URL: '${process.env.BACKEND_API_URL}',
  production: false,
  apiUrl: '${process.env.apiUrl}',
  clientId: '${process.env.clientId}',
  redirectUri: '${process.env.redirectUri}',
  Oauth2_URL: '${process.env.Oauth2_URL}',
  Auth_Mezon: '${process.env.Auth_Mezon}',
  API_SUBJECT:'${process.env.apiSubject}'
};
`;
fs.writeFileSync('src/environments/environment.ts', envConfigFile);
