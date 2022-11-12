import { defaultEnv } from './default.env';
import { registerAs } from '@nestjs/config';

const databaseEnv = {
  name: process.env.DATABASE_NAME || defaultEnv.database.name,
  uri: process.env.DATABASE_URI || defaultEnv.database.uri,
};

export type DatabaseConfig = typeof databaseEnv;

export const databaseConfig = registerAs('database', () => databaseEnv);
