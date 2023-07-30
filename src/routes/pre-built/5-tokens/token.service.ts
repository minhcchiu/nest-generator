import { PaginateModel, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { ConfigName, JWTConfig } from "~config/environment";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";

import { DecodedToken, TokenPayload } from "./interface";
import { Token, TokenDocument } from "./schemas/token.schema";
import { User } from "../1-users/schemas/user.schema";

@Injectable()
export class TokenService extends BaseService<TokenDocument> {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		@InjectModel(Token.name) model: PaginateModel<TokenDocument>,
	) {
		super(model);
	}

	async generateToken(payload: any, secret: string, expiresIn: number) {
		const token = await this.jwtService.signAsync(payload, {
			secret,
			expiresIn,
		});
		const expiresAt = Date.now() + expiresIn;

		return { token, expiresAt };
	}

	async generateAccessToken(payload: TokenPayload) {
		const { accessToken } = this.configService.get<JWTConfig>(ConfigName.jwt);

		return this.generateToken(
			payload,
			accessToken.secretKey,
			accessToken.expiresIn,
		);
	}

	async generateRefreshToken(payload: TokenPayload) {
		const { refreshToken } = this.configService.get<JWTConfig>(ConfigName.jwt);

		return this.generateToken(
			payload,
			refreshToken.secretKey,
			refreshToken.expiresIn,
		);
	}

	async generateUserToken(payload: any) {
		const { registerToken } = this.configService.get<JWTConfig>(ConfigName.jwt);

		return this.generateToken(
			payload,
			registerToken.secretKey,
			registerToken.expiresIn,
		);
	}

	async generateResetPasswordToken(payload: TokenPayload) {
		const { resetPasswordToken } = this.configService.get<JWTConfig>(
			ConfigName.jwt,
		);

		return this.generateToken(
			payload,
			resetPasswordToken.secretKey,
			resetPasswordToken.expiresIn,
		);
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

		return this.jwtService.verifyAsync(token, {
			secret: secretKey || config.secretKey,
		});
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
		const { resetPasswordToken } = this.configService.get<JWTConfig>(
			ConfigName.jwt,
		);

		return this.verifyToken(token, resetPasswordToken.secretKey);
	}

	async generateUserAuth(
		user: User & {
			_id: Types.ObjectId;
		},
	) {
		const payload = {
			_id: user._id.toString(),
			role: user.role,
			email: user.email,
			phone: user.phone,
			fullName: user.fullName,
			avatar: user.avatar,
			gender: user.gender,
			dateOfBirth: user.dateOfBirth,
			status: user.status,
		};

		const { accessToken, refreshToken } = await this.generateAuthTokens(
			payload,
		);

		await this.updateOne(
			{ user: user._id },
			{ user: user._id, ...refreshToken },
			{ upsert: true },
		);

		return { accessToken, refreshToken, user: payload };
	}
}
