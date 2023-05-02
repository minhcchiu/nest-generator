import { ObjectId } from 'mongodb';
import { MailService } from '~lazy-modules/mail/mail.service';
import { authSelect } from '~routes/users/select/auth.select';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../users/user.service';
import { ResetPasswordDto } from './dto/reset-password-by-otp.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';
import { LoginSocialDto } from './dto/login-social.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async login({ password, ...credentials }: LoginDto) {
    const user = await this.userService.findOne(credentials, { projection: authSelect });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.deleted) {
      throw new BadRequestException('The account has been removed.');
    }

    const isPasswordValid = await this.userService.comparePassword(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect account!');
    }

    const tokens = await this.tokenService.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    delete user.password;
    return { ...tokens, user };
  }

  async loginBySocial(data: LoginSocialDto) {
    let user = await this.userService.findOne({ socialToken: data.socialToken });

    if (!user) user = await this.userService.create(data);

    const tokens = await this.tokenService.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    delete user.password;
    return { ...tokens, user };
  }

  async register(data: RegisterDto) {
    const { _id, role } = await this.userService.create(data);

    const tokens = await this.tokenService.generateAuthTokens({
      _id: _id,
      role: role,
    });

    const user = { ...data, _id, role };

    delete user.password;
    return { ...tokens, user };
  }

  async sendRegisterToken(data: RegisterDto) {
    await this.userService.validateCreateUser({ email: data.email, phone: data.phone });

    const token = await this.tokenService.generateUserToken(data);
    await this.mailService.sendRegisterToken(token, data.email, 'Register account.');

    return { message: 'Send register account success!' };
  }

  async activateRegisterToken(token: string) {
    const decoded = await this.tokenService.verifySignupToken(token);

    // delete key of token
    delete decoded.iat;
    delete decoded.exp;

    return this.register(decoded);
  }

  async logout(userId: ObjectId) {
    return this.userService.updateById(userId, { refreshToken: '' });
  }

  async refreshToken(token: string) {
    const decoded = await this.tokenService.verifyRefreshToken(token);

    const user = await this.userService.findById(decoded._id, { projection: authSelect });

    if (!user) throw new NotFoundException('Invalid refresh');

    const tokens = await this.tokenService.generateAuthTokens({ _id: user._id, role: user.role });

    delete user.password;
    return { ...tokens, user };
  }

  async forgotPasswordSendTokenLink(email: string) {
    // const user = await this.userService.findOne({ email });

    // // check user exist
    // if (user) {
    //   if (user.deleted) {
    //     throw new BadRequestException('The account has been removed.');
    //   }

    //   // Create expireTime
    //   // const expireTime = this.jwtConfig.expirationTime.resetPassword;

    //   // Generate accessToken
    //   const token = await this.tokenService.generateAccessToken({
    //     _id: user._id,
    //     role: user.role,
    //   });

    //   const resetPasswordLink = `${this.appConfig.appUrl}/auth/reset-password?token=${token}`;

    //   // Send mail
    //   await this.mailService.sendResetPasswordToken(
    //     resetPasswordLink,
    //     'data.email',
    //     'Reset password.',
    //   );

    //   // Response otp
    //   if (this.appConfig.env === appEnvEnum.DEVELOPMENT) {
    //     return { resetPasswordLink, token };
    //   }
    // }

    return email;
  }

  async resetPasswordByOtp(data: ResetPasswordDto) {
    return data;
    // const { authKey, authValue } = data;

    // const filter = { [authKey]: authValue };

    // const user = await this.userService.findOne(filter);

    // // check user exist
    // if (user) {
    //   if (user.deleted) {
    //     throw new BadRequestException('The account has been removed.');
    //   }

    //   // Add deviceID to fcmTokens
    //   if (data.deviceID) {
    //     await this.userService.addDeviceID(user._id, data.deviceID);
    //     // user.deviceID = data.deviceID;
    //   }

    //   // verify otpCode
    //   await this.otpService.verifyOtp({
    //     authKey,
    //     authValue,
    //     otpType: OtpType.RESET_PASSWORD,
    //     otpCode: data.otpCode,
    //   });

    //   // update password
    //   await this.userService.updatePasswordById(user._id, {
    //     oldPassword: data.password,
    //     newPassword: data.password,
    //   });

    //   // success
    //   const tokens = await this.generateAuthTokens(user);
    //   return { ...tokens, user };
    // }
  }

  async resetPassword(userId: ObjectId, password: string) {
    return { userId, password };
    // const user = await this.userService.updatePasswordById(userId, {
    //   oldPassword: '',
    //   newPassword: password,
    // });
    // // success
    // const tokens = await this.generateAuthTokens(user);
    // return { ...tokens, user };
  }
}
