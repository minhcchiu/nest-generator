import { registerAs } from '@nestjs/config';
import { defaultEnv } from './default.env';

const jwtEnv = {
  secret: process.env.JWT_SECRET || defaultEnv.jwt.secret,
  expiresIn: process.env.JWT_EXPIRESIN || defaultEnv.jwt.expiresin,
  expirationTime: {
    accessToken:
      process.env.JWT_ACCESS_EXPIRATION || defaultEnv.jwt.accessExpiration,
    refreshToken:
      process.env.JWT_REFRESH_EXPIRATION || defaultEnv.jwt.refreshExpiration,
    signupToken:
      process.env.JWT_SIGNUP_EXPIRATION || defaultEnv.jwt.signupExpiration,
    resetPasswordToken:
      process.env.JWT_RESET_PASSWORD_EXPIRATION ||
      defaultEnv.jwt.resetPasswordExpiration,
  },
  secrets: {
    accessToken: process.env.JWT_ACCESS_SECRET || defaultEnv.jwt.accessSecret,
    refreshToken:
      process.env.JWT_REFRESH_SECRET || defaultEnv.jwt.refreshSecret,
    signupToken: process.env.JWT_SIGNUP_SECRET || defaultEnv.jwt.signupSecret,
  },
};

export type JWTConfig = typeof jwtEnv;

export const jwtCofig = registerAs('jwt', () => jwtEnv);
