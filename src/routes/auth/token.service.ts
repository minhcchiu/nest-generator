import { ConfigService } from '@nestjs/config';
import { DecodedToken, TokenPayload } from './interface';
import { ForbiddenException, Global, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Global()
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService, private config: ConfigService) {}
  async generateToken(payload: TokenPayload, secret: string, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    const atExpire = this.config.get('jwt').expirationTime.access;
    const atSecret = this.config.get('jwt').secrets.access;

    return this.generateToken(payload, atSecret, atExpire);
  }

  async generateRefreshToken(
    payload: TokenPayload,
    rtSecret = this.config.get('jwt').secrets.refresh,
    rtExpire = this.config.get('jwt').expirationTime.refresh,
  ): Promise<string> {
    return this.generateToken(payload, rtSecret, rtExpire);
  }

  async generateSignupToken(
    payload: any,
    suSecret = this.config.get('jwt').secrets.signup,
    suExpire = this.config.get('jwt').expirationTime.signup,
  ): Promise<string> {
    return this.generateToken(payload, suSecret, suExpire);
  }

  async verifyToken(
    token: string,
    secret = this.config.get('jwt').secret,
  ): Promise<DecodedToken> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, { secret });

      return decoded;
    } catch (error: any) {
      throw new ForbiddenException(error.message);
    }
  }

  async verifyAccessToken(
    token: string,
    secret = this.config.get('jwt').secrets.access,
  ): Promise<DecodedToken> {
    return this.verifyToken(token, secret);
  }

  async verifyRefreshToken(
    rfToken: string,
    rtSecret = this.config.get('jwt').secrets.refresh,
  ): Promise<DecodedToken> {
    return this.verifyToken(rfToken, rtSecret);
  }

  async verifySignupToken(
    token: string,
    secret = this.config.get('jwt').secrets.signup,
  ): Promise<any> {
    return this.verifyToken(token, secret);
  }
}
