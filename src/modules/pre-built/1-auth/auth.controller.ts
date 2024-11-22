import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ObjectId } from "mongodb";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";
import { AuthService } from "./auth.service";
import { EmailDto } from "./dto/email.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordWithOtpDto } from "./dto/password-with-otp.dto";
import { ResetPasswordWithTokenDto } from "./dto/password-with-token.dto";
import { RegisterDto } from "./dto/register.dto";
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

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: ObjectId, @Body("fcmToken") fcmToken?: string) {
    return this.authService.logout(userId, fcmToken);
  }

  @Public()
  @Post("refresh_token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() { token, fcmToken }: TokenDto) {
    return this.authService.refreshToken(token, fcmToken);
  }

  @Public()
  @Post("forgot_password")
  @HttpCode(HttpStatus.OK)
  async sendForgotPassword(@Body() { email }: EmailDto) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post("reset_password/token")
  @HttpCode(HttpStatus.OK)
  async resetPasswordByToken(@Body() body: ResetPasswordWithTokenDto) {
    return this.authService.resetPasswordWithToken(body);
  }

  @Public()
  @Post("reset_password/otp")
  @HttpCode(HttpStatus.OK)
  async resetPasswordByOtp(@Body() body: ResetPasswordWithOtpDto) {
    return this.authService.resetPasswordWithOtp(body);
  }
}
