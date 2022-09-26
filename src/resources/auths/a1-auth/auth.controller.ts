import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

import { dbCollections } from '~config/collections/schemas.collection';
import { UserService } from '~common/c1-users/user.service';
import {
  ResetPasswordDto,
  SigninDto,
  SigninSocialDto,
  SignupDto,
  SignupSendTokenDto,
  TokenDto,
  PasswordDto,
} from './dto';
import { AuthService } from './auth.service';
import { EmailDto } from '~common/c1-users/dto';
import { Logger } from '~lazy-modules/logger/logger.service';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
@ApiTags('auth')
@Controller(dbCollections.auth.path)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  /**
   * Signin with email/phone and password
   *
   * @param body
   * @returns
   */
  @Post('signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  /**
   * Signup with otp
   *
   * @param body
   * @returns
   */
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  /**
   * Signin with social
   *
   * @param body
   * @returns
   */
  @Post('signin_social')
  async signinWithSocial(@Body() body: SigninSocialDto) {
    return this.authService.signinWithSocial(body);
  }

  /**
   * Signup send token to email
   *
   * @param body
   * @returns
   */
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
  @Post('sign_out')
  async signout(
    @Body('_id') idUser: Types.ObjectId,
    @Body('deviceID') deviceID: string,
  ) {
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
  @Put('reset_password')
  async resetPassword(
    @GetCurrentUserId() userId: Types.ObjectId,
    @Body() { password }: PasswordDto,
  ) {
    return this.authService.resetPassword(userId, password);
  }
}
