import { registerAs } from '@nestjs/config';

const appEnv = {
  env: process.env.NODE_ENV || 'development',
  port: +process.env.PORT || 8888,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8888',
};

export type AppConfig = typeof appEnv;

export const appCofig = registerAs('app', () => appEnv);
