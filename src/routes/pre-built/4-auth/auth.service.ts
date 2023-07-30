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
import { LoginWithSocialDto } from "./dto/login-with-social.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { OtpService } from "../6-otp/otp.service";
import { OtpType } from "../6-otp/enums/otp-type";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly otpService: OtpService,
	) {}

	async login({ password, deviceID, ...credential }: LoginDto) {
		const user = await this.userService.findOne(credential, {
			projection: authSelect,
		});

		if (!user) {
			throw new NotFoundException("User not found.");
		}

		if (user.deleted) {
			throw new BadRequestException("The account has been removed.");
		}

		const isPasswordValid = await this.userService.comparePassword(
			user.password,
			password,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException("Incorrect account!");
		}

		if (deviceID) this.userService.addDeviceID(user._id.toString(), deviceID);

		return this.tokenService.generateUserAuth(user);
	}

	async loginWithSocial({ deviceID, ...data }: LoginWithSocialDto) {
		let user = await this.userService.findOne(
			{ socialID: data.socialID, socialToken: data.socialToken },
			{ projection: authSelect },
		);

		if (!user)
			user = await this.userService.create({
				...data,
				status: AccountStatus.ACTIVE,
			});

		if (deviceID) this.userService.addDeviceID(user._id.toString(), deviceID);

		return this.tokenService.generateUserAuth(user);
	}

	async register({ deviceID, ...data }: RegisterDto) {
		await this.userService.validateCreateUser({
			phone: data.phone,
			email: data.email,
		});

		const user = await this.userService.create(data);

		if (deviceID) this.userService.addDeviceID(user._id.toString(), deviceID);

		return this.tokenService.generateUserAuth(user);
	}

	async sendRegisterToken(data: RegisterDto) {
		await this.userService.validateCreateUser({
			email: data.email,
			phone: data.phone,
		});

		const token = await this.tokenService.generateUserToken(data);
		await this.mailService.sendRegisterToken(
			token,
			data.email,
			"Register account.",
		);

		return { message: "Send register account success!" };
	}

	async sendRegisterOtp(data: RegisterDto) {
		await this.userService.validateCreateUser({
			email: data.email,
			phone: data.phone,
		});

		const otpItem: any = { otpType: OtpType.SIGNUP };

		if (data.phone) otpItem.phone = data.phone;
		else otpItem.email = data.email;

		return this.otpService.sendOtp(otpItem);
	}

	async activateRegisterToken(token: string) {
		const decoded = await this.tokenService.verifySignupToken(token);

		// delete key of token
		delete decoded.iat;
		delete decoded.exp;

		decoded.status = AccountStatus.ACTIVE;
		return this.register(decoded);
	}

	async logout(userId: string, deviceID?: string) {
		Promise.all([
			this.userService.removeDeviceID(userId, deviceID),
			this.tokenService.deleteOne({ user: userId }),
		]).then((res) => {
			console.log({ res });
		});

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

		if (tokenDoc && tokenDoc.user)
			return this.tokenService.generateUserAuth(<any>tokenDoc.user);

		throw new UnauthorizedException("Invalid token!");
	}

	async sendResetPasswordToken(email: string) {
		const user = await this.userService.findOne({ email });

		if (!user) {
			throw new NotFoundException("User not found.");
		}

		if (user.deleted) {
			throw new BadRequestException("The account has been removed.");
		}

		const token = await this.tokenService.generateResetPasswordToken({
			_id: user._id.toString(),
			role: user.role,
			fullName: user.fullName,
			avatar: user.avatar,
		});

		await this.tokenService.updateOne(
			{ user: user._id },
			{ user: user._id, ...token },
			{ upsert: true },
		);

		await this.mailService.sendResetPasswordToken(
			token,
			email,
			"Reset password.",
		);

		return { email };
	}

	async resetPassword(token: string, password: string) {
		const [decoded, tokenDoc] = await Promise.all([
			this.tokenService.verifyResetPasswordToken(token),
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
