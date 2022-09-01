import { Body, Controller, Post, Put } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  SigninDto,
  SigninSocialDto,
  SignupDto,
  SignupSendTokenDto,
  TokenDto,
} from './dto';
import { AuthService } from './auth.service';
import { UserService } from '~common/c1-user/user.service';
import { CreateUserDto } from '~common/c1-user/dto/create-user.dto';
import { schemas } from '~config/collections/schemas.collection';

@ApiTags('auth')
@Controller(schemas.auth.path)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Signin with social
   * @param body
   * @returns
   */
  @Post('signin-social')
  async signinWithSocial(@Body() body: SigninSocialDto) {
    return this.authService.signinWithSocial(body);
  }

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
   * Sign up send token to email
   * @param body
   * @returns
   */
  @Post('signup-send-token')
  async signupSendToken(@Body() body: SignupSendTokenDto) {
    return this.authService.signupSendToken(body);
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
   * Activate account by token
   * @param body
   * @returns
   */
  @Post('verify-signup-token')
  async verifySignupToken(@Body() { token }: TokenDto) {
    return this.authService.verifySignupToken(token);
  }

  /**
   * Sign out
   * @param idUser
   * @param deviceID
   * @returns
   */
  @Post('sign-out')
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
  @Put('refresh-token')
  async refreshToken(@Body() { token }: TokenDto) {
    return this.authService.refreshToken(token);
  }

  /**
   * Forgot password
   * @param email
   * @returns
   */
  @Put('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.refreshToken(email);
  }
}
