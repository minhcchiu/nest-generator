import { registerAs } from '@nestjs/config';
import { defaultEnv } from './default.env';

const appEnv = {
  env: process.env.NODE_ENV || defaultEnv.app.env,
  port: +process.env.PORT || defaultEnv.app.port,
  clientUrl: process.env.CLIENT_URL || defaultEnv.app.clientUrl,
};

export type AppConfig = typeof appEnv;

export const appCofig = registerAs('app', () => appEnv);
