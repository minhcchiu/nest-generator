import { ObjectId } from 'mongodb';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { Logger } from '~lazy-modules/logger/logger.service';
import { CreateUserDto } from '~routes/users/dto/create-user.dto';

import { Body, Controller, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password-by-otp.dto';
import { LoginDto } from './dto/sign-in.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @HttpCode(201)
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('login_by_social')
  async loginBySocial(@Body() body: CreateUserDto) {
    return this.authService.loginBySocial(body);
  }

  @Post('send_register_token')
  async sendRegisterToken(@Body() body: CreateUserDto) {
    return this.authService.sendRegisterToken(body);
  }

  @HttpCode(201)
  @Post('activate_register_token')
  async activateRegisterToken(@Body() { token }: TokenDto) {
    return this.authService.activateRegisterToken(token);
  }

  @Post('logout')
  async logout(@GetCurrentUserId() userId: ObjectId) {
    return this.authService.logout(userId);
  }

  // @Post('refresh_token')
  // async refreshToken(@GetCurrentUserId() userId: ObjectId) {
  //   return this.authService.refreshTokenByUserId(userId);
  // }

  @Post('reset_password_by_otp')
  async resetPasswordByOtp(@Body() body: ResetPasswordDto) {
    return this.authService.resetPasswordByOtp(body);
  }

  @Post('send_reset_password_link')
  async forgotPassword(@Body() { email }: { email: string }) {
    return this.authService.forgotPasswordSendTokenLink(email);
  }

  @UseGuards(AtGuard)
  @Patch('reset_password')
  async resetPassword(
    @GetCurrentUserId() userId: ObjectId,
    @Body() { password }: { password: string },
  ) {
    return this.authService.resetPassword(userId, password);
  }
}
