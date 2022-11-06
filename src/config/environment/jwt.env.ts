import { registerAs } from '@nestjs/config';

import { defaultEnv } from './default.env';

const jwtEnv = {
  secret: process.env.JWT_SECRET || defaultEnv.jwt.secret,
  expiresIn: process.env.JWT_EXPIRESIN || defaultEnv.jwt.expiresin,
  expirationTime: {
    access:
      process.env.JWT_ACCESS_EXPIRATION || defaultEnv.jwt.accessExpiration,
    refresh:
      process.env.JWT_REFRESH_EXPIRATION || defaultEnv.jwt.refreshExpiration,
    signup:
      process.env.JWT_SIGNUP_EXPIRATION || defaultEnv.jwt.signupExpiration,
    resetPassword:
      process.env.JWT_RESET_PASSWORD_EXPIRATION ||
      defaultEnv.jwt.resetPasswordExpiration,
  },
  secrets: {
    access: process.env.JWT_ACCESS_SECRET || defaultEnv.jwt.accessSecret,
    refresh: process.env.JWT_REFRESH_SECRET || defaultEnv.jwt.refreshSecret,
    signup: process.env.JWT_SIGNUP_SECRET || defaultEnv.jwt.signupSecret,
  },
};

export type JWTConfig = typeof jwtEnv;

export const jwtConfig = registerAs('jwt', () => jwtEnv);
