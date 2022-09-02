import { Body, Controller, Post, Patch } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  ResetPasswordByTokenDto,
  SigninDto,
  SigninSocialDto,
  SignupDto,
  SignupSendTokenDto,
  TokenDto,
} from './dto';
import { AuthService } from './auth.service';
import { UserService } from '~common/c1-user/user.service';
import { schemas } from '~config/collections/schemas.collection';

@ApiTags('auth')
@Controller(schemas.auth.path)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   *Sign in with email/phone and password
   * @param body
   * @returns
   */
  @Post('signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  /**
   * Signin with social
   * @param body
   * @returns
   */
  @Post('signin_social')
  async signinWithSocial(@Body() body: SigninSocialDto) {
    return this.authService.signinWithSocial(body);
  }

  /**
   * Sign up with otp
   * @param body
   * @returns
   */
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  /**
   * Sign up send token to email
   * @param body
   * @returns
   */
  @Post('signup_send_token_link')
  async signupSendTokenLink(@Body() body: SignupSendTokenDto) {
    return this.authService.signupSendTokenLink(body);
  }

  /**
   * Activate account by token
   * @param body
   * @returns
   */
  @Post('verify_signup_token')
  async verifySignupToken(@Body() { token }: TokenDto) {
    return this.authService.verifySignupToken(token);
  }

  /**
   * Sign out
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
      console.log({ error });
    });

    return { success: true };
  }

  /**
   * Refresh token
   * @param {refreshToken}
   * @returns
   */
  @Patch('refresh_token')
  async refreshToken(@Body() { token }: TokenDto) {
    return this.authService.refreshToken(token);
  }

  /**
   * Forgot password
   * @param email
   * @returns
   */
  @Post('forgot_password_send_token_link')
  async forgotPasswordSendTokenLink(@Body('email') email: string) {
    return this.authService.forgotPasswordSendTokenLink(email);
  }

  /**
   * Reset password
   * @param token
   * @returns
   */
  @Post('reset_password')
  async resetPasswordByToken(
    @Body() { token, password }: ResetPasswordByTokenDto,
  ) {
    return this.authService.resetPasswordByToken(token, password);
  }
}
