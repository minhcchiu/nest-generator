import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { addMinutes } from "date-fns";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { EnvStatic } from "src/configurations/static.env";
import { BaseService } from "~base-inherit/base.service";
import { generateRandomKey } from "~helpers/generate-random-key";
import { RegisterDto } from "../1-auth/dto/register.dto";
import { UserDocument } from "../1-users/schemas/user.schema";
import { DecodedToken, TokenPayload } from "./interface";
import { Token, TokenDocument } from "./schemas/token.schema";

@Injectable()
export class TokenService extends BaseService<TokenDocument> {
  private tokenService: TokenService;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Token.name) model: Model<TokenDocument>,
  ) {
    super(model);

    this.tokenService = this;
  }

  async generateToken(payload: Record<string, any>, secret: string, expiresIn: number) {
    const expiredDate = addMinutes(new Date(), expiresIn);
    const token = await this.jwtService.signAsync(
      {
        ...payload,
        expiresAt: expiredDate,
      },
      { secret, expiresIn: `${expiresIn}m` },
    );

    return { token, expiresAt: expiredDate };
  }

  async generateRegisterUserToken(payload: RegisterDto) {
    const { registerToken } = EnvStatic.getJWTConfig();

    return this.generateToken(payload, registerToken.secretKey, registerToken.expiresIn);
  }

  async generateForgotPasswordToken(user: UserDocument) {
    const payload: TokenPayload = {
      userId: user._id,
      roleIds: user.roleIds,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      socialID: user.socialID,
      accountType: user.accountType,
    };

    const { forgotPasswordToken } = EnvStatic.getJWTConfig();

    return this.generateToken(
      payload,
      forgotPasswordToken.secretKey,
      forgotPasswordToken.expiresIn,
    );
  }

  async verifyAccessToken(token: string): Promise<DecodedToken> {
    const { accessToken } = EnvStatic.getJWTConfig();

    return this._verifyToken(token, accessToken.secretKey);
  }

  async verifyRefreshToken(token: string): Promise<DecodedToken> {
    const { refreshToken } = EnvStatic.getJWTConfig();

    return this._verifyToken(token, refreshToken.secretKey);
  }

  async verifyUserToken(token: string) {
    const { registerToken } = EnvStatic.getJWTConfig();

    return this._verifyToken(token, registerToken.secretKey);
  }

  async verifyForgotPasswordToken(token: string): Promise<DecodedToken> {
    const { forgotPasswordToken } = EnvStatic.getJWTConfig();

    return this._verifyToken(token, forgotPasswordToken.secretKey);
  }

  async _generateAccessToken(payload: TokenPayload) {
    const { accessToken } = EnvStatic.getJWTConfig();

    return this.generateToken(payload, accessToken.secretKey, accessToken.expiresIn);
  }

  async _generateRefreshToken(payload: TokenPayload) {
    const { refreshToken } = EnvStatic.getJWTConfig();

    return this.generateToken(payload, refreshToken.secretKey, refreshToken.expiresIn);
  }

  async _verifyToken(token: string, secretKey?: string) {
    const config = EnvStatic.getJWTConfig();

    return this.jwtService.verifyAsync(token, {
      secret: secretKey || config.secretKey,
    });
  }

  async generateAuthTokens(payload: TokenPayload) {
    const jwtConfig = EnvStatic.getJWTConfig();

    payload.tokenId = generateRandomKey(15);

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, jwtConfig.accessToken.secretKey, jwtConfig.accessToken.expiresIn),
      this.generateToken(
        payload,
        jwtConfig.refreshToken.secretKey,
        jwtConfig.refreshToken.expiresIn,
      ),
    ]);

    await this.saveToken({
      userId: payload.userId,
      token: refreshToken.token,
      tokenId: payload.tokenId,
      expiresAt: refreshToken.expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async saveToken(input: { userId: ObjectId; token: string; tokenId: string; expiresAt: Date }) {
    const existingToken = await this.tokenService.findOne({ userId: input.userId });

    const validTokens =
      existingToken?.tokens?.filter(t => new Date(t.expiresAt) > new Date()) || [];
    validTokens.push({ token: input.token, expiresAt: input.expiresAt, tokenId: input.tokenId });

    return this.tokenService.updateOne(
      { userId: input.userId },
      {
        tokens: validTokens,
        expiresAt: new Date(
          Math.max(existingToken?.expiresAt.getTime() || 0, input.expiresAt.getTime()),
        ),
      },
      { upsert: true },
    );
  }
}
