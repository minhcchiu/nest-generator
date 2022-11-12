import { defaultEnv } from './default.env';
import { registerAs } from '@nestjs/config';

const appEnv = {
  env: process.env.APP_ENV || defaultEnv.app.env,
  port: +process.env.APP_PORT || defaultEnv.app.port,
  appUrl: process.env.APP_URL || defaultEnv.app.appUrl,
};

export type AppConfig = typeof appEnv;

export const appConfig = registerAs('app', () => appEnv);
