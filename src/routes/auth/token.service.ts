import { ConfigName, JWTConfig } from '~config/environment';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DecodedToken, TokenPayload } from './interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: any, secret: string, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    const { accessToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secret, expiresIn } = accessToken;

    return this.generateToken(payload, secret, expiresIn);
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    const { refreshToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secret, expiresIn } = refreshToken;

    return this.generateToken(payload, secret, expiresIn);
  }

  async generateUserToken(payload: any): Promise<string> {
    const { registerToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secret, expiresIn } = registerToken;

    return this.generateToken(payload, secret, expiresIn);
  }

  async generateAuthTokens(
    payload: TokenPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, secret?: string): Promise<DecodedToken> {
    const config = this.configService.get<JWTConfig>(ConfigName.jwt);
    const jwtSecret = secret || config.secret;

    return this.jwtService.verifyAsync(token, { secret: jwtSecret });
  }

  async verifyAccessToken(token: string): Promise<DecodedToken> {
    const { accessToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secret } = accessToken;

    return this.verifyToken(token, secret);
  }

  async verifyRefreshToken(token: string): Promise<DecodedToken> {
    const { refreshToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secret } = refreshToken;

    return this.verifyToken(token, secret);
  }

  async verifySignupToken(token: string): Promise<any> {
    const { registerToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secret } = registerToken;

    return this.verifyToken(token, secret);
  }
}
