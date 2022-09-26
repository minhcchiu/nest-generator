import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig, JWTConfig } from '~config/enviroment';
import { MailService } from '~lazy-modules/mail/mail.service';
import { OtpService } from '~auths/a2-otp/otp.service';
import { UserService } from '~common/c1-users/user.service';
import {
  ResetPasswordDto,
  SigninDto,
  SigninSocialDto,
  SignupDto,
  SignupSendTokenDto,
} from './dto';
import { AuthResponse, AuthTokenPayload, TokenPayload } from './interface';
import { TokenService } from './token.service';
import { OtpType } from '~auths/a2-otp/enum/otp-type.enum';
import { Types } from 'mongoose';
import { appEnvEnum } from '~config/enviroment/enums/app_env.enum';

@Injectable()
export class AuthService {
  private appConfig: AppConfig;
  private jwtConfig: JWTConfig;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app');
    this.jwtConfig = this.configService.get<JWTConfig>('jwt');
  }

  /**
   * Sign in with email/phone and password
   *
   * @param { phone, email, password, deviceID, }
   * @returns
   */
  async signin({
    phone,
    email,
    password,
    deviceID,
  }: SigninDto): Promise<AuthResponse> {
    const filter = phone ? { phone } : { email };

    const user = await this.userService.findOne(filter);

    if (user && !user.deleted) {
      // check password
      await this.userService.checkPasswordById(user._id, password);

      // if exist deviceID => add deviceID to fcmTokens
      if (deviceID) {
        await this.userService.addDeviceID(user._id, deviceID);
        user.deviceID = deviceID;
      }

      // generate tokens
      const tokens = await this.generateAuthTokens(user);

      // success
      return { ...tokens, user };
    }

    throw new BadRequestException(
      'The account does not exist or has been removed from the system.',
    );
  }

  /**
   * Sign in with social
   *
   * @param data
   * @returns
   */
  async signinWithSocial(data: SigninSocialDto): Promise<AuthResponse> {
    const { deviceID, accountType, authKey } = data;

    // find user
    let user = await this.userService.findOne({ authKey, accountType });

    // check user not exist
    if (!user) user = await this.userService.create(data);

    // check user has been deleted
    if (user.deleted)
      await this.userService.updateById(user._id, { authKey: '' });

    // check add deviceID
    if (deviceID) {
      await this.userService.addDeviceID(user._id, deviceID);

      user.deviceID = deviceID;
    }

    // generate tokens
    const tokens = await this.generateAuthTokens(user);

    // success
    return { ...tokens, user };
  }

  /**
   * Signup with otp
   *
   * @param data
   * @returns
   */
  async signup(data: SignupDto): Promise<AuthResponse> {
    const { phone, email } = data;

    const filter = phone ? { phone } : { email };
    const filterKey = phone ? 'phone' : 'email';

    // validate user
    const userExist = await this.userService.findOne(filter);

    // check user exist
    if (userExist) {
      if (!userExist.deleted)
        throw new BadRequestException('Account already exists in the system.');

      // Delete old email
      await this.userService.updateById(userExist._id, {
        [filterKey]: '',
      });
    }

    // verify otpCode
    await this.otpService.verifyOtp({
      [filterKey]: data[filterKey],
      otpType: OtpType.SIGNUP,
      otpCode: data.otpCode,
    });

    // create user
    const user = await this.userService.create(data);

    // generate tokens
    const tokens = await this.generateAuthTokens(user);

    // success
    return { ...tokens, user };
  }

  /**
   * Sign up with token
   *
   * @param data
   * @returns
   */
  async signupSendTokenLink(data: SignupSendTokenDto) {
    // check email
    const userExist = await this.userService.findOne({ email: data.email });

    // check user exist
    if (userExist) {
      if (!userExist.deleted)
        throw new BadRequestException('Account already exists in the system.');

      // Delete old email
      await this.userService.updateById(userExist._id, { email: '' });
    }

    // generate sugnup token
    const token = await this.tokenService.generateSignupToken(data);

    const verificationLink = `${this.appConfig.appUrl}/auth/verify-signup-token?token=${token}`;

    // send mail
    await this.mailService.sendSignupToken(
      verificationLink,
      'data.email',
      'Register account.',
    );

    // success
    return { verificationLink, token };
  }

  /**
   * Activate signup
   *
   * @param token
   * @return
   */
  async activateSignupToken(token: string) {
    const decoded = await this.tokenService.verifySignupToken(token);

    // delete key of token
    delete decoded.iat;
    delete decoded.exp;

    // validate user
    const userExist = await this.userService.findOne({ email: decoded.email });

    // check user exist
    if (userExist) {
      if (!userExist.deleted)
        throw new BadRequestException('Account already exists in the system.');

      // Delete old email
      await this.userService.updateById(userExist._id, { email: '' });
    }

    // create user
    const user = await this.userService.create(decoded);

    // generate tokens
    const tokens = await this.generateAuthTokens(user);

    // success
    return { ...tokens, user };
  }

  /**
   * Refresh token
   *
   * @param token
   * @return
   */
  async refresh(token: string) {
    // decoded data
    const decoded = await this.tokenService.verifyRefreshToken(token);

    // find user
    const user = await this.userService.findById(decoded._id);

    // check user
    if (!user) throw new NotFoundException('Invalid refresh');

    // generate tokens
    const tokens = await this.generateAuthTokens(user);

    // success
    return { ...tokens, user };
  }

  /**
   * Forgot password send token link
   *
   * @param email
   * @returns
   */
  async forgotPasswordSendTokenLink(email: string) {
    // check email
    const user = await this.userService.findOne({ email });

    // check user exist
    if (user) {
      if (user.deleted) {
        const deletedAt = new Date(user.updatedAt).toLocaleString();

        throw new BadRequestException(`Account deleted on ${deletedAt}`);
      }

      // create expireTime
      const expireTime = this.jwtConfig.expirationTime.resetPassword;

      // generate accessToken
      const token = await this.tokenService.generateAccessToken(
        { _id: user._id, role: user.role },
        expireTime,
      );

      const resetPasswordLink = `${this.appConfig.appUrl}/auth/reset-password?token=${token}`;

      // send mail
      await this.mailService.sendResetPasswordToken(
        resetPasswordLink,
        'data.email',
        'Reset password.',
      );

      // Reponse otp
      if (this.appConfig.env === appEnvEnum.DEVELOPMENT) {
        return { resetPasswordLink, token };
      }
      // success
    }

    throw new NotFoundException('Email not found.');
  }

  /**
   * Reset password by otp
   *
   * @param data
   * @return
   */
  async resetPasswordByOtp(data: ResetPasswordDto) {
    const { email, phone } = data;

    const filter = phone ? { phone } : { email };
    const filterKey = phone ? 'phone' : 'email';

    const user = await this.userService.findOne(filter);

    // check user exist
    if (user) {
      if (user.deleted) {
        const deletedAt = new Date(user.updatedAt).toLocaleString();

        throw new BadRequestException(`Account deleted on ${deletedAt}`);
      }

      // if exist deviceID => add deviceID to fcmTokens
      if (data.deviceID) {
        await this.userService.addDeviceID(user._id, data.deviceID);
        user.deviceID = data.deviceID;
      }

      // verify otpCode
      await this.otpService.verifyOtp({
        [filterKey]: filter[filterKey],
        otpType: OtpType.RESET_PASSWORD,
        otpCode: data.otpCode,
      });

      // update password
      await this.userService.updatePasswordById(user._id, data.password);

      // generate tokens
      const tokens = await this.generateAuthTokens(user);

      // success
      return { ...tokens, user };
    }

    throw new NotFoundException('Account not found.');
  }

  /**
   * Reset password
   *
   * @param userId
   * @param password
   * @return
   */
  async resetPassword(userId: Types.ObjectId, password: string) {
    const user = await this.userService.updatePasswordById(userId, password);

    // generate tokens
    const tokens = await this.generateAuthTokens(user);

    // success
    return { ...tokens, user };
  }

  /**
   * Generate auth tokens
   *
   * @param user
   * @returns
   */
  private async generateAuthTokens(user: any): Promise<AuthTokenPayload> {
    const payload: TokenPayload = {
      _id: user._id,
      role: user.role,
    };

    // Generate ac_token and rf_token
    const [ac_token, rf_token] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    // Success
    return { ac_token, rf_token };
  }
}
