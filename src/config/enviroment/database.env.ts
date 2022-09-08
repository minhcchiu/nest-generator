import { registerAs } from '@nestjs/config';

const databaseEnv = {
  name: process.env.DATABASE_NAME,
  uri: process.env.DATABASE_URI,
};

export type DatabaseConfig = typeof databaseEnv;

export const databaseCofig = registerAs('database', () => databaseEnv);
