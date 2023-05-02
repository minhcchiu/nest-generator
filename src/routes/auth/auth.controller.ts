import { ObjectId } from 'mongodb';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Public } from '~decorators/public.decorator';

import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password-by-otp.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { LoginSocialDto } from './dto/login-social.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Public()
  @HttpCode(201)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login_by_social')
  async loginBySocial(@Body() body: LoginSocialDto) {
    return this.authService.loginBySocial(body);
  }

  @Public()
  @HttpCode(201)
  @Post('send_register_token')
  async sendRegisterToken(@Body() body: RegisterDto) {
    return this.authService.sendRegisterToken(body);
  }

  @Public()
  @HttpCode(201)
  @Post('activate_register_token')
  async activateRegisterToken(@Body() { token }: TokenDto) {
    return this.authService.activateRegisterToken(token);
  }

  @Post('logout')
  async logout(@GetCurrentUserId() userId: ObjectId) {
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh_token')
  async refreshToken(@Body() { token }: TokenDto) {
    return this.authService.refreshToken(token);
  }

  @Public()
  @Post('reset_password_by_otp')
  async resetPasswordByOtp(@Body() body: ResetPasswordDto) {
    return this.authService.resetPasswordByOtp(body);
  }

  @Public()
  @Post('send_reset_password_link')
  async forgotPassword(@Body() { email }: { email: string }) {
    return this.authService.forgotPasswordSendTokenLink(email);
  }

  @Public()
  @Patch('reset_password')
  async resetPassword(
    @GetCurrentUserId() userId: ObjectId,
    @Body() { password }: { password: string },
  ) {
    return this.authService.resetPassword(userId, password);
  }
}
