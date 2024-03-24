import { Types } from "mongoose";
import { generateRandomKey } from "~helpers/generate-random-key";
import { AccountStatus } from "~pre-built/1-users/enums/account-status.enum";
import { TokenService } from "~pre-built/5-tokens/token.service";
import { FirebaseService } from "~shared/firebase/firebase.service";
import { MailService } from "~shared/mail/mail.service";

import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";

import { AccountType } from "../1-users/enums/account-type.enum";
import { authSelect } from "../1-users/select/auth.select";
import { UserService } from "../1-users/user.service";
import { OtpType } from "../6-otp/enums/otp-type";
import { OtpService } from "../6-otp/otp.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SendRegisterTokenDto } from "./dto/send-register-token.dto";
import { SocialLoginDto } from "./dto/social-login.dto";
import { SocialInterface } from "./interfaces/social.interface";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly firebaseService: FirebaseService,
		private readonly otpService: OtpService,
	) {}

	async register({ fcmToken, ...input }: RegisterDto) {
		await this.userService.validateCreateUser(input);

		const newUser = await this.userService.createUser(input);

		if (fcmToken) this.userService.saveFcmToken(newUser._id, fcmToken);

		return this.tokenService.generateUserAuth(newUser);
	}

	async login({ fcmToken, ...credential }: LoginDto) {
		const user = await this.userService.findOne(
			{ authKeys: credential.authKey },
			{ projection: authSelect },
		);

		if (!user) throw new NotFoundException("Incorrect account!");

		if (user.status === AccountStatus.Deleted)
			throw new BadRequestException("The account has been removed.");

		const isPasswordValid = await this.userService.comparePassword(
			user.password,
			credential.password,
		);

		if (!isPasswordValid) throw new UnauthorizedException("Incorrect account!");

		if (fcmToken) this.userService.saveFcmToken(user._id, fcmToken);

		return this.tokenService.generateUserAuth(user);
	}

	async sendRegisterToken(input: RegisterDto) {
		await this.userService.validateCreateUser(input);

		const { token, expiresAt } =
			await this.tokenService.generateUserToken(input);

		await this.mailService.sendRegisterToken(
			{
				token,
				expiresAt,
				fullName: input.fullName,
			},
			input.email,
		);

		return input;
	}

	async sendRegisterOtp(input: SendRegisterTokenDto) {
		await this.userService.validateCreateUser(input);

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

		decoded.status = AccountStatus.Verified;

		return this.register(decoded);
	}

	async socialLogin({ fcmToken, idToken, accountType }: SocialLoginDto) {
		const decodedIdToken = await this.firebaseService.verifyIdToken(idToken);

		let foundUser = await this.userService.findOne(
			{ socialID: decodedIdToken.sub },
			{ projection: authSelect },
		);

		if (!foundUser) {
			const newUser = await this.userService.createUser({
				status: AccountStatus.Verified,
				fullName: decodedIdToken.name,
				socialID: decodedIdToken.sub,
				authKeys: [decodedIdToken.sub],
				avatar: decodedIdToken.picture,
				email: decodedIdToken.email,
				accountType,
				password: generateRandomKey(32),
			});

			foundUser = newUser.toObject();
		}

		if (fcmToken) this.userService.saveFcmToken(foundUser._id, fcmToken);

		return this.tokenService.generateUserAuth(foundUser);
	}

	async logout(userId: Types.ObjectId, fcmToken?: string) {
		Promise.all([
			this.userService.removeFcmTokens([fcmToken]),
			this.tokenService.deleteOne({ user: userId }),
		]);

		return { message: "Logout success!" };
	}

	async validateSocialLogin(
		accountType: AccountType,
		socialData: SocialInterface,
	) {
		return {
			accountType,
			...socialData,
		};
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

		if (user.status === AccountStatus.Deleted) {
			throw new BadRequestException("The account has been removed.");
		}

		const { expiresAt, token } =
			await this.tokenService.generateForgotPasswordToken({
				_id: user._id.toString(),
				roles: user.roles,
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
				roles: user.roles,
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
