import { ConfigName, JWTConfig } from '~config/environment';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DecodedToken, TokenPayload } from './interface';
import { PaginateModel } from 'mongoose';
import { Token, TokenDocument } from './token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class TokenService extends BaseService<TokenDocument> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name) model: PaginateModel<TokenDocument>,
  ) {
    super(model);
  }

  async generateToken(payload: any, secretKey: string, expiresIn: number) {
    const token = await this.jwtService.signAsync(payload, { secret: secretKey, expiresIn });
    const MILLISECONDS_IN_SECOND = 1000;

    const expiresAt = Date.now() + expiresIn * MILLISECONDS_IN_SECOND;

    return { token, expiresAt };
  }

  async generateAccessToken(payload: TokenPayload) {
    const { accessToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secretKey, expiresIn } = accessToken;

    return this.generateToken(payload, secretKey, expiresIn);
  }

  async generateRefreshToken(payload: TokenPayload) {
    const { refreshToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secretKey, expiresIn } = refreshToken;
    return this.generateToken(payload, secretKey, expiresIn);
  }

  async generateUserToken(payload: any) {
    const { registerToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secretKey, expiresIn } = registerToken;

    return this.generateToken(payload, secretKey, expiresIn);
  }

  async generateResetPasswordToken(payload: TokenPayload) {
    const { resetPasswordToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    const { secretKey, expiresIn } = resetPasswordToken;

    return this.generateToken(payload, secretKey, expiresIn);
  }

  async generateAuthTokens(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, secretKey?: string) {
    const config = this.configService.get<JWTConfig>(ConfigName.jwt);

    return this.jwtService.verifyAsync(token, { secret: secretKey || config.secretKey });
  }

  async verifyAccessToken(token: string): Promise<DecodedToken> {
    const { accessToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    return this.verifyToken(token, accessToken.secretKey);
  }

  async verifyRefreshToken(token: string): Promise<DecodedToken> {
    const { refreshToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    return this.verifyToken(token, refreshToken.secretKey);
  }

  async verifySignupToken(token: string) {
    const { registerToken } = this.configService.get<JWTConfig>(ConfigName.jwt);
    return this.verifyToken(token, registerToken.secretKey);
  }

  async verifyResetPasswordToken(token: string): Promise<DecodedToken> {
    const { resetPasswordToken } = this.configService.get<JWTConfig>(ConfigName.jwt);

    return this.verifyToken(token, resetPasswordToken.secretKey);
  }
}
