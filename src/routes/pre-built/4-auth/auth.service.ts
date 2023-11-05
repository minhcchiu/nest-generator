import { AccountStatus } from "~pre-built/1-users/enums/account-status.enum";
import { TokenService } from "~pre-built/5-tokens/token.service";
import { MailService } from "~shared/mail/mail.service";
import { authSelect } from "../1-users/select/auth.select";

import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";

import { UserService } from "../1-users/user.service";
import { SocialLoginDto } from "./dto/social-login.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { OtpService } from "../6-otp/otp.service";
import { OtpType } from "../6-otp/enums/otp-type";
import { Role } from "../1-users/enums/role.enum";
import { Types } from "mongoose";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly otpService: OtpService,
	) {}

	async register({ deviceID, ...input }: RegisterDto) {
		await this.userService.validateCreateUser({
			phone: input.phone,
			email: input.email,
			username: input.username,
		});

		const newUser = await this.userService.create({
			...input,
			status: AccountStatus.NOT_VERIFIED,
			role: Role.USER,
		});

		if (deviceID) this.userService.addDeviceID(newUser._id, deviceID);

		return this.tokenService.generateUserAuth(newUser);
	}

	async login({ password, deviceID, ...credential }: LoginDto) {
		const user = await this.userService.findOne(credential, {
			projection: authSelect,
		});

		if (!user) throw new NotFoundException("Incorrect account!");

		if (user.status === AccountStatus.DELETED)
			throw new BadRequestException("The account has been removed.");

		const isPasswordValid = await this.userService.comparePassword(
			user.password,
			password,
		);

		if (!isPasswordValid) throw new UnauthorizedException("Incorrect account!");

		if (deviceID) this.userService.addDeviceID(user._id, deviceID);

		return this.tokenService.generateUserAuth(user);
	}

	async socialLogin({ deviceID, ...input }: SocialLoginDto) {
		let foundUser = await this.userService.findOne(
			{ socialID: input.socialID },
			{ projection: authSelect },
		);

		if (!foundUser) {
			const newUser = await this.userService.create({
				...input,
				status: AccountStatus.VERIFIED,
				role: Role.USER,
			});

			foundUser = newUser.toObject();
		}

		if (deviceID) this.userService.addDeviceID(foundUser._id, deviceID);

		return this.tokenService.generateUserAuth(foundUser);
	}

	async sendRegisterToken(input: RegisterDto) {
		await this.userService.validateCreateUser({
			email: input.email,
			phone: input.phone,
		});

		const { token, expiresAt } =
			await this.tokenService.generateUserToken(input);
		this.mailService.sendRegisterToken(
			{
				token,
				expiresAt,
				fullName: input.fullName,
			},
			input.email,
		);

		return {
			email: input.email,
			phone: input.phone,
			message: "Send register account success!",
		};
	}

	async sendRegisterOtp(input: RegisterDto) {
		await this.userService.validateCreateUser({
			email: input.email,
			phone: input.phone,
		});

		const otpItem: any = { otpType: OtpType.SIGNUP };

		if (input.phone) otpItem.phone = input.phone;
		else otpItem.email = input.email;

		return this.otpService.sendOtp(otpItem);
	}

	async activateRegisterToken(token: string) {
		const decoded = await this.tokenService.verifySignupToken(token);

		// delete key of token
		delete decoded.iat;
		delete decoded.exp;

		decoded.status = AccountStatus.VERIFIED;
		return this.register(decoded);
	}

	async logout(userId: Types.ObjectId, deviceID?: string) {
		Promise.all([
			this.userService.removeDeviceID(userId, deviceID),
			this.tokenService.deleteOne({ user: userId }),
		]);

		return { message: "Logout success!" };
	}

	async refreshToken(token: string) {
		const [tokenDoc] = await Promise.all([
			this.tokenService.findOne(
				{ token },
				{ populate: { path: "user", select: authSelect } },
			),
			this.tokenService.verifyRefreshToken(token),
		]);

		if (!tokenDoc?.userId)
			throw new UnauthorizedException("Invalid refresh token!");

		return this.tokenService.generateUserAuth(<any>tokenDoc.userId);
	}

	async forgotPassword(email: string) {
		const user = await this.userService.findOne({ email });

		if (!user) {
			throw new NotFoundException("User not found.");
		}

		if (user.status === AccountStatus.DELETED) {
			throw new BadRequestException("The account has been removed.");
		}

		const { expiresAt, token } =
			await this.tokenService.generateForgotPasswordToken({
				_id: user._id.toString(),
				role: user.role,
				fullName: user.fullName,
				avatar: user.avatar,
			});

		await this.tokenService.updateOne(
			{ user: user._id },
			{ user: user._id, token, expiresAt },
			{ upsert: true },
		);

		this.mailService.sendForgotPasswordToken(
			{ token, expiresAt, fullName: user.fullName },
			email,
		);

		return { email };
	}

	async resetPassword(token: string, password: string) {
		const [decoded, tokenDoc] = await Promise.all([
			this.tokenService.verifyForgotPasswordToken(token),
			this.tokenService.deleteOne({ token }),
		]);

		if (!tokenDoc) throw new UnauthorizedException("Invalid token!");

		const user = await this.userService.resetPassword(
			decoded._id.toString(),
			password,
			{
				projection: authSelect,
			},
		);

		const { accessToken, refreshToken } =
			await this.tokenService.generateAuthTokens({
				_id: user._id.toString(),
				role: user.role,
				fullName: user.fullName,
				avatar: user.avatar,
			});

		await this.tokenService.updateOne(
			{ user: user._id, token: refreshToken.token },
			{ user: user._id, ...refreshToken },
			{ upsert: true },
		);

		return { accessToken, refreshToken, user };
	}
}
