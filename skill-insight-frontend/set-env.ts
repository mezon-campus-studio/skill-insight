import * as dotenv from 'dotenv';

import * as fs from 'fs';

dotenv.config({
  path: './.env'
});

const envConfigFile = `
export const environment = {

  production: false,

  BACKEND_API_URL:
    '${process.env['BACKEND_API_URL']}',

  apiUrl:
    '${process.env['apiUrl']}',

  clientId:
    '${process.env['clientId']}',

  redirectUri:
    '${process.env['redirectUri']}',

  Oauth2_URL:
    '${process.env['Oauth2_URL']}'
};
`;

fs.writeFileSync(
  'src/environments/environment.ts',
  envConfigFile
);