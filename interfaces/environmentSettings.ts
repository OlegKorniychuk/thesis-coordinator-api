import ms from 'ms';

export interface EnvironmentSettings {
  port: number;
  databaseUrl: string;
  accessTokenSecret: string;
  accessTokenExpiresIn: ms.StringValue;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: ms.StringValue;
}
