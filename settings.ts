import {EnvironmentSettings} from '@interfaces/environmentSettings';
import dotenv from 'dotenv';
import ms from 'ms';

dotenv.config();

const port = process.env.PORT;
if (!port) throw new Error('Invalid .env format: PORT missing');
const parsedPort = parseInt(port);
if (!parsedPort) throw new Error('Invalid .env format: PORT must be an integer');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('Invalid .env format: DATABASE_URL missing');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
if (!accessTokenSecret) throw new Error('Invalid .env format: ACCESS_TOKEN_SECRET missing');

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
if (!refreshTokenSecret) throw new Error('Invalid .env format: REFRESH_TOKEN_SECRET missing');

const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
if (!accessTokenExpiresIn) throw new Error('Invalid .env format: ACCESS_TOKEN_EXPIRES_IN missing');
let time = ms(accessTokenExpiresIn as ms.StringValue);
if (!time)
  throw new Error('Invalid .env format: ACCESS_TOKEN_EXPIRES_IN should be in ms string format');

const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
if (!refreshTokenExpiresIn)
  throw new Error('Invalid .env format: REFRESH_TOKEN_EXPIRES_IN missing');
time = ms(refreshTokenExpiresIn as ms.StringValue);
if (!time)
  throw new Error('Invalid .env format: REFRESH_TOKEN_EXPIRES_IN should be in ms string format');

const settings: EnvironmentSettings = {
  port: parsedPort,
  databaseUrl: databaseUrl,
  accessTokenSecret: accessTokenSecret,
  refreshTokenSecret: refreshTokenSecret,
  accessTokenExpiresIn: accessTokenExpiresIn as ms.StringValue,
  refreshTokenExpiresIn: refreshTokenExpiresIn as ms.StringValue
};

console.log('CURRENT SETTINGS', settings);

export default settings;
