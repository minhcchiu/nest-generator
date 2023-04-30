import { Types } from 'mongoose';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { dbCollections } from '~config/collections/schemas.collection';
import { Logger } from '~lazy-modules/logger/logger.service';

import { Body, Controller, HttpCode, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  PasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignInSocialDto,
  SignupDto,
  SignupSendTokenDto,
  TokenDto,
} from './dto';
import { UserService } from '../users/user.service';
import { EmailDto } from '../users/dto';

@ApiTags('auth')
@Controller(dbCollections.auth.path)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  /**
   * Sign-In with email/phone and password
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('signin')
  async signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  /**
   * Signup with otp
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  /**
   * SignIn with social
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('signin_social')
  async signinWithSocial(@Body() body: SignInSocialDto) {
    return this.authService.signinWithSocial(body);
  }

  /**
   * Signup send token to email
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('signup_send_token_link')
  async signupSendTokenLink(@Body() body: SignupSendTokenDto) {
    return this.authService.signupSendTokenLink(body);
  }

  /**
   * Activate account by token link
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('activate_signup_token')
  async activateSignupToken(@Body() { token }: TokenDto) {
    return this.authService.activateSignupToken(token);
  }

  /**
   * Sign out
   *
   * @param idUser
   * @param deviceID
   * @returns
   */
  @HttpCode(200)
  @Post('sign_out')
  async signout(@Body('_id') idUser: Types.ObjectId, @Body('deviceID') deviceID: string) {
    // Remove deviceID and pop fcm token
    await this.userService.removeDeviceID(idUser, deviceID).catch((error) => {
      this.logger.warn(AuthController.name, error);
    });

    return { success: true };
  }

  /**
   * Refresh token
   *
   * @param token
   * @returns
   */
  @HttpCode(200)
  @Put('refresh_token')
  async refresh(@Body() { token }: TokenDto) {
    return this.authService.refresh(token);
  }

  /**
   * Reset password by otp
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Put('reset_password_by_otp')
  async resetPasswordByOtp(@Body() body: ResetPasswordDto) {
    return this.authService.resetPasswordByOtp(body);
  }

  /**
   * Forgot password
   *
   * @param email
   * @returns
   */
  @HttpCode(200)
  @Put('send_reset_password_link')
  async forgotPassword(@Body() { email }: EmailDto) {
    return this.authService.forgotPasswordSendTokenLink(email);
  }

  /**
   * Reset password
   *
   * @param userId
   * @param password
   * @returns
   */
  @UseGuards(AtGuard)
  @HttpCode(200)
  @Put('reset_password')
  async resetPassword(
    @GetCurrentUserId() userId: Types.ObjectId,
    @Body() { password }: PasswordDto,
  ) {
    return this.authService.resetPassword(userId, password);
  }
}
