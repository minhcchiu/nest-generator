import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PhoneHelper } from 'src/utils/helper/phone.helper';
import { UserService } from '~common/c1-user/user.service';
import { OtpService } from '~common/c2-otp/otp.service';
import { AuthResponse, AuthTokenPayload, TokenPayload } from './interface';
import { TokenService } from './token.service';
import {
  SigninEmailDto,
  SigninPhoneDto,
  SigninSocialDto,
  SignupEmailDto,
  SignupPhoneDto,
} from './dto';
import { CreateUserDto } from '~common/c1-user/dto/create-user.dto';
import { MailService } from '~lazy-modules/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Sign in with email and password
   * @param data
   * @returns
   */
  async signinWithEmail(data: SigninEmailDto): Promise<AuthResponse> {
    const { password, email, deviceID } = data;

    const user = await this.userService.findOne({ email });

    if (user) {
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
   * Sign in with account local
   * @param data
   * @returns
   */
  async signinWithPhone(data: SigninPhoneDto): Promise<AuthResponse> {
    const { phone, password, deviceID } = data;
    // validate phone
    PhoneHelper.validatePhone(phone);

    // Get and check user exist by phone
    const user = await this.userService.findOne({ phone });

    if (user) {
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
   * Sign up with account email and password
   * @param data
   * @returns
   */
  async signupWithEmailAndOtp(data: SignupEmailDto): Promise<AuthResponse> {
    // validate user
    const userExist = await this.userService.findUserExist({
      email: data.email,
    });

    // check user exist
    if (userExist) {
      if (!userExist.deleted)
        throw new BadRequestException('Account already exists in the system.');

      // Delete old email
      await this.userService.updateById(userExist._id, { email: '' });
    }

    // verify otpCode by phone
    await this.otpService.verifyOtpEmail({
      email: data.email,
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
   * Sign up with phone
   * @param data
   * @returns
   */
  async signupWithPhoneAndOtp(data: SignupPhoneDto): Promise<AuthResponse> {
    // validate user
    const userExist = await this.userService.findUserExist({
      phone: data.phone,
    });

    // check user exist
    if (userExist) {
      if (!userExist.deleted)
        throw new BadRequestException('Account already exists in the system.');

      // Delete old phone
      await this.userService.updateById(userExist._id, { phone: '' });
    }

    // verify otpCode by phone
    await this.otpService.verifyOtpPhone({
      phone: data.phone,
      otpCode: data.otpCode,
    });

    // new user
    const user = await this.userService.create(data);

    // generate tokens
    const tokens = await this.generateAuthTokens(user);

    // success
    return { ...tokens, user };
  }

  /**
   * Sign up with token
   * @param data
   */
  async signupSendTokenToEmail(data: CreateUserDto) {
    // check email
    const userExist = await this.userService.findUserExist({
      email: data.email,
    });

    // check user exist
    if (userExist) {
      if (!userExist.deleted)
        throw new BadRequestException('Account already exists in the system.');

      // Delete old phone
      await this.userService.updateById(userExist._id, { email: '' });
    }

    // generate sugnup token
    const token = await this.tokenService.generateSignupToken(data);
    const verificationLink = `http://localhost:8888/auth/verify-signup-token/${token}`;

    // send mail
    await this.mailService.sendSignupToken(
      verificationLink,
      data.email,
      'Register account.',
    );

    // success
    return verificationLink;
  }

  /**
   * Activation account
   * @param token
   * @return
   */
  async verifySignupToken(token: string) {
    const decoded = await this.tokenService.verifySignupToken(token);

    // delete key of token
    delete decoded.iat;
    delete decoded.exp;

    // validate user
    const userExist = await this.userService.findUserExist({
      email: decoded.email,
    });

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
   * @param token
   */
  async refreshToken(token: string) {
    const decoded = await this.tokenService.verifyRefreshToken(token);

    const user = await this.userService.findById(decoded._id);

    if (!user) throw new NotFoundException('Invalid refreshToken');

    return this.generateAuthTokens({ _id: user._id, role: user.role });
  }

  /**
   * Generate auth tokens
   * @param user
   * @returns
   */
  async generateAuthTokens(user: any): Promise<AuthTokenPayload> {
    const payload: TokenPayload = {
      _id: user._id,
      role: user.role,
    };
    // Generate ac_token and rf_token
    const [ac_token, rf_token] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    return { ac_token, rf_token };
  }
}
