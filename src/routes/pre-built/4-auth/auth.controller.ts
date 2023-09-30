import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";

import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { EmailDto } from "./dto/email.dto";
import { SocialLoginDto } from "./dto/social-login.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/password.dto";
import { RegisterDto } from "./dto/register.dto";
import { TokenDto } from "./dto/token.dto";
import { Throttle } from "@nestjs/throttler";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@HttpCode(201)
	@Post("register")
	async register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Public()
	@Throttle({ default: { limit: 8, ttl: 60000 } })
	@Post("login")
	async login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}

	@Public()
	@Post("social_login")
	async socialLogin(@Body() body: SocialLoginDto) {
		return this.authService.socialLogin(body);
	}

	@Public()
	@HttpCode(201)
	@Post("send_register_token")
	async sendRegisterToken(@Body() body: RegisterDto) {
		return this.authService.sendRegisterToken(body);
	}

	@Public()
	@HttpCode(201)
	@Post("send_register_otp")
	async sendRegisterOtp(@Body() body: RegisterDto) {
		return this.authService.sendRegisterOtp(body);
	}

	@Public()
	@HttpCode(201)
	@Post("activate_register_token")
	async activateRegisterToken(@Body() { token }: TokenDto) {
		return this.authService.activateRegisterToken(token);
	}

	@Post("logout")
	async logout(
		@GetCurrentUserId() userId: string,
		@Body("deviceID") deviceID?: string,
	) {
		return this.authService.logout(userId, deviceID);
	}

	@Public()
	@Post("refresh_token")
	async refreshToken(@Body() { token }: TokenDto) {
		return this.authService.refreshToken(token);
	}

	@Public()
	@Post("forgot_password")
	async sendForgotPassword(@Body() { email }: EmailDto) {
		return this.authService.forgotPassword(email);
	}

	@Public()
	@Post("reset_password")
	async resetPassword(@Body() { token, password }: ResetPasswordDto) {
		return this.authService.resetPassword(token, password);
	}
}
