import { ForbiddenException, Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DecodedToken, TokenPayload } from './interface';

@Global()
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Generate token
   * @param payload
   * @param secret
   * @param expiresIn
   * @returns
   */
  async generateToken(
    payload: TokenPayload,
    secret = this.config.get('jwt').secret,
    expiresIn = this.config.get('jwt').expiresIn,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  /**
   * Generate accessToken
   * @param payload
   * @param atSecret
   * @param atExpire
   * @returns
   */
  async generateAccessToken(
    payload: TokenPayload,
    atExpire = this.config.get('jwt').expirationTime.accessToken,
    atSecret = this.config.get('jwt').secrets.accessToken,
  ): Promise<string> {
    return this.generateToken(payload, atSecret, atExpire);
  }

  /**
   * Generate refresh token
   * @param payload
   * @param rtSecret
   * @param rtExpire
   * @returns
   */
  async generateRefreshToken(
    payload: TokenPayload,
    rtSecret = this.config.get('jwt').secrets.refreshToken,
    rtExpire = this.config.get('jwt').expirationTime.refreshToken,
  ): Promise<string> {
    return this.generateToken(payload, rtSecret, rtExpire);
  }

  /**
   * Generate sign up token
   * @param payload
   * @param suSecret
   * @param suExpire
   * @returns
   */
  async generateSignupToken(
    payload: any,
    suSecret = this.config.get('jwt').secrets.signupToken,
    suExpire = this.config.get('jwt').expirationTime.signupToken,
  ): Promise<string> {
    return this.generateToken(payload, suSecret, suExpire);
  }

  /**
   * Verify token
   * @param token
   * @param secret
   * @returns
   */
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

  /**
   * Verify accessToken
   * @param token
   * @param secret
   * @returns
   */
  async verifyAccessToken(
    token: string,
    secret = this.config.get('jwt').secrets.accessToken,
  ): Promise<DecodedToken> {
    return this.verifyToken(token, secret);
  }

  /**
   * Verify refreshToken
   * @param rfToken
   * @param rtSecret
   * @returns
   */
  async verifyRefreshToken(
    rfToken: string,
    rtSecret = this.config.get('jwt').secrets.refreshToken,
  ): Promise<DecodedToken> {
    return this.verifyToken(rfToken, rtSecret);
  }

  /**
   * Verify refreshToken
   * @param token
   * @param secret
   * @returns
   */
  async verifySignupToken(
    token: string,
    secret = this.config.get('jwt').secrets.signupToken,
  ): Promise<any> {
    return this.verifyToken(token, secret);
  }
}
