import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel, Types } from "mongoose";
import { EnvStatic } from "src/configurations/static.env";
import { BaseService } from "~base-inherit/base.service";
import { User } from "../1-users/schemas/user.schema";
import { DecodedToken, TokenPayload } from "./interface";
import { Token, TokenDocument } from "./schemas/token.schema";

@Injectable()
export class TokenService extends BaseService<TokenDocument> {
	constructor(
		private readonly jwtService: JwtService,
		@InjectModel(Token.name) model: PaginateModel<TokenDocument>,
	) {
		super(model);
	}

	async generateToken(payload: any, secret: string, expiresIn: number) {
		const token = await this.jwtService.signAsync(payload, {
			secret,
			expiresIn: `${expiresIn}m`,
		});

		const expiresAt = new Date().getTime() + expiresIn * 60 * 1000;

		return { token, expiresAt };
	}

	async generateAccessToken(payload: TokenPayload) {
		const { accessToken } = EnvStatic.getJWTConfig();

		return this.generateToken(
			payload,
			accessToken.secretKey,
			accessToken.expiresIn,
		);
	}

	async generateRefreshToken(payload: TokenPayload) {
		const { refreshToken } = EnvStatic.getJWTConfig();

		return this.generateToken(
			payload,
			refreshToken.secretKey,
			refreshToken.expiresIn,
		);
	}

	async generateUserToken(payload: any) {
		const { registerToken } = EnvStatic.getJWTConfig();

		return this.generateToken(
			payload,
			registerToken.secretKey,
			registerToken.expiresIn,
		);
	}

	async generateForgotPasswordToken(payload: TokenPayload) {
		const { forgotPasswordToken } = EnvStatic.getJWTConfig();

		return this.generateToken(
			payload,
			forgotPasswordToken.secretKey,
			forgotPasswordToken.expiresIn,
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
		const config = EnvStatic.getJWTConfig();

		return this.jwtService.verifyAsync(token, {
			secret: secretKey || config.secretKey,
		});
	}

	async verifyAccessToken(token: string): Promise<DecodedToken> {
		const { accessToken } = EnvStatic.getJWTConfig();

		return this.verifyToken(token, accessToken.secretKey);
	}

	async verifyRefreshToken(token: string): Promise<DecodedToken> {
		const { refreshToken } = EnvStatic.getJWTConfig();

		return this.verifyToken(token, refreshToken.secretKey);
	}

	async verifySignupToken(token: string) {
		const { registerToken } = EnvStatic.getJWTConfig();

		return this.verifyToken(token, registerToken.secretKey);
	}

	async verifyForgotPasswordToken(token: string): Promise<DecodedToken> {
		const { forgotPasswordToken } = EnvStatic.getJWTConfig();

		return this.verifyToken(token, forgotPasswordToken.secretKey);
	}

	async generateUserAuth(
		user: User & {
			_id: Types.ObjectId;
		},
	) {
		const payload: TokenPayload = {
			_id: user._id.toString(),
			roles: user.roles,
			email: user.email,
			phone: user.phone,
			fullName: user.fullName,
			avatar: user.avatar,
			gender: user.gender,
			dateOfBirth: user.dateOfBirth,
			status: user.status,
			accountType: user.accountType,
		};

		const { accessToken, refreshToken } =
			await this.generateAuthTokens(payload);

		await this.updateOne(
			{ userId: user._id.toString() },
			{ userId: user._id.toString(), ...refreshToken },
			{ upsert: true },
		);

		return { accessToken, refreshToken, user: payload };
	}
}
