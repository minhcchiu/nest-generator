import { registerAs } from '@nestjs/config';

import { defaultEnv } from './default.env';

const databaseEnv = {
  name: process.env.DATABASE_NAME || defaultEnv.database.name,
  uri: process.env.DATABASE_URI || defaultEnv.database.uri,
};

export type DatabaseConfig = typeof databaseEnv;

export const databaseCofig = registerAs('database', () => databaseEnv);
