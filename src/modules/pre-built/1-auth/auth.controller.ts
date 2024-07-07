import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Types } from "mongoose";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";
import { AuthService } from "./auth.service";
import { EmailDto } from "./dto/email.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/password.dto";
import { RegisterDto } from "./dto/register.dto";
import { SendOtpDto } from "./dto/send-otp.dto";
import { SocialLoginDto } from "./dto/social-login.dto";
import { TokenDto } from "./dto/token.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	//  ----- Method: POST -----
	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post("register")
	async register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Public()
	@Throttle({ default: { limit: 8, ttl: 60000 } })
	@Post("login")
	@HttpCode(HttpStatus.OK)
	async login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}

	@Public()
	@Post("social_login")
	@HttpCode(HttpStatus.OK)
	async socialLogin(@Body() body: SocialLoginDto) {
		return this.authService.socialLogin(body);
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post("send_token")
	async sendToken(@Body() body: RegisterDto) {
		return this.authService.sendToken(body);
	}

	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post("activate_token")
	async activateToken(@Body() { token }: TokenDto) {
		return this.authService.activateToken(token);
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post("send_otp")
	async sendOtp(@Body() body: SendOtpDto) {
		return this.authService.sendOtp(body);
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(
		@GetCurrentUserId() userId: Types.ObjectId,
		@Body("fcmToken") fcmToken?: string,
	) {
		return this.authService.logout(userId, fcmToken);
	}

	@Public()
	@Post("refresh_token")
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Body() { token }: TokenDto) {
		return this.authService.refreshToken(token);
	}

	@Public()
	@Post("forgot_password")
	@HttpCode(HttpStatus.OK)
	async sendForgotPassword(@Body() { email }: EmailDto) {
		return this.authService.forgotPassword(email);
	}

	@Public()
	@Post("reset_password")
	@HttpCode(HttpStatus.OK)
	async resetPassword(@Body() { token, password }: ResetPasswordDto) {
		return this.authService.resetPassword(token, password);
	}
}
