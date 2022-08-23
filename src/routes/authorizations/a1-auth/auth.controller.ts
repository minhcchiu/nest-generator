import { Body, Controller, Post, Put } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  SigninEmailDto,
  SigninPhoneDto,
  SigninSocialDto,
  SignupEmailDto,
  SignupPhoneDto,
  TokenDto,
} from './dto';
import { AuthService } from './auth.service';
import { UserService } from '~common/c1-user/user.service';
import { CreateUserDto } from '~common/c1-user/dto/create-user.dto';
import { collectionNames } from '~config/collections/collectionName';

@ApiTags('Auth')
@Controller(collectionNames.auth.path)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   *Sign in with account email
   * @param body
   * @returns
   */
  @Post('signin-email')
  async signinWithEmail(@Body() body: SigninEmailDto) {
    return this.authService.signinWithEmail(body);
  }

  /**
   * Sign up with email, otp
   * @param body
   * @returns
   */
  @Post('signup-email')
  async signupWithEmailAndOtp(@Body() body: SignupEmailDto) {
    return this.authService.signupWithEmailAndOtp(body);
  }

  /**
   * Sign up with token
   * @param body
   * @returns
   */
  @Post('signup-send-token-email')
  async signupSendTokenToEmail(@Body() body: CreateUserDto) {
    return this.authService.signupSendTokenToEmail(body);
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
   *Sign in with account local
   * @param body
   * @returns
   */
  @Post('signin-phone')
  async signinWithPhone(@Body() body: SigninPhoneDto) {
    return this.authService.signinWithPhone(body);
  }

  /**
   * Sign up with phone, otp
   * @param body
   * @returns
   */
  @Post('signup-phone')
  async signupWithPhoneAndOtp(@Body() body: SignupPhoneDto) {
    return this.authService.signupWithPhoneAndOtp(body);
  }

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
}
