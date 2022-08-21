import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { phoneHelper } from 'src/utils/helper/phone.helper';
import { UserService } from '~common/c1-user/user.service';
import OtpService from '~common/c2-otp/otp.service';
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
import { MailService } from 'src/lazy-modules/mail/mail.service';

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

    // check user has exist
    if (!user)
      throw new NotFoundException('The account does not exist in the system.');

    // check user deleted
    if (user.deleted)
      throw new BadRequestException(
        'The account has been removed from the system.',
      );

    // compare password
    const isPasswordValid = await this.userService.comparePasswordById(
      user._id,
      password,
    );

    // Check password valid
    if (!isPasswordValid)
      throw new BadRequestException('Incorrect phone or password.');

    // if exist deviceID => add deviceID to fcmTokens
    if (deviceID) {
      await this.userService.addDeviceID(user._id, deviceID);

      user.deviceID = deviceID;
    }

    // generate tokens
    const tokens = await this.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    // success
    return { user, tokens };
  }

  /**
   * Sign in with account local
   * @param data
   * @returns
   */
  async signinWithPhone(data: SigninPhoneDto): Promise<AuthResponse> {
    const { phone, password, deviceID } = data;
    // validate phone
    phoneHelper.validatePhone(phone);

    // Get and check user exist by phone
    const user = await this.userService.findOne({ phone });

    if (!user)
      throw new NotFoundException('The account does not exist in the system.');

    // check deleted
    if (user.deleted) {
      throw new BadRequestException(
        'The account has been removed from the system.',
      );
    }

    // compare password
    const isPasswordValid = await this.userService.comparePasswordById(
      user._id,
      password,
    );

    // Check valid password
    if (!isPasswordValid)
      throw new BadRequestException('Incorrect phone or password.');

    // if exist deviceID => add deviceID to fcmTokens
    if (deviceID) {
      await this.userService.addDeviceID(user._id, deviceID);

      user.deviceID = deviceID;
    }

    // generate tokens
    const tokens = await this.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    // success
    return { user, tokens };
  }

  /**
   * Sign in with social
   * @param data
   * @returns
   */
  async signinWithSocial(data: SigninSocialDto): Promise<AuthResponse> {
    const { deviceID, accountType, authKey } = data;
    // find user by tokenLogin + typeRegister
    let user = await this.userService.findOne({ authKey, accountType });

    // if not exist user => create new
    if (!user) user = await this.userService.create(data);

    // if user has been deleted => update deleted = false
    if (user.deleted) {
      user = await this.userService.updateById(user._id, { deleted: false });
    }

    // if exist deviceID => update deviceID and fcmTokens
    if (deviceID) {
      await this.userService.addDeviceID(user._id, deviceID);

      user.deviceID = deviceID;
    }

    // generate tokens
    const tokens = await this.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    // success
    return { user, tokens };
  }

  /**
   * Sign up with account email and password
   * @param data
   * @returns
   */
  async signupWithEmail(data: SignupEmailDto): Promise<AuthResponse> {
    const { email, deviceID, otpCode, password, ...rest } = data;

    // validate user
    const userExist = await this.userService.findUserExist({ email });

    // if userExist has not exist => sign up
    if (!userExist) {
      // verify otpCode by phone
      await this.otpService.verifyOtpEmail({ email, otpCode });

      // new user
      const user = await this.userService.create({
        ...rest,
        email,
        deviceID,
        password,
        fcmTokens: deviceID ? [deviceID] : [],
      });

      // generate tokens
      const tokens = await this.generateAuthTokens({
        _id: user._id,
        role: user.role,
      });

      // success
      return { user, tokens };
    }

    // check user deleted
    if (userExist.deleted)
      throw new BadRequestException(
        'The account has been removed from the system.',
      );

    throw new BadRequestException('Account already exists in the system.');
  }

  /**
   * Sign up with phone
   * @param data
   * @returns
   */
  async signupWithPhone(data: SignupPhoneDto): Promise<AuthResponse> {
    const { phone, deviceID, otpCode, password, ...rest } = data;

    // validate user
    const userExist = await this.userService.findUserExist({ phone });

    // if userExist has not exist => sign up
    if (!userExist) {
      // verify otpCode by phone
      await this.otpService.verifyOtpPhone({ phone, otpCode });

      // new user
      const user = await this.userService.create({
        ...rest,
        phone,
        deviceID,
        password,
        fcmTokens: deviceID ? [deviceID] : [],
      });

      // generate tokens
      const tokens = await this.generateAuthTokens({
        _id: user._id,
        role: user.role,
      });

      // success
      return { user, tokens };
    }

    // check user deleted
    if (userExist.deleted)
      throw new BadRequestException(
        'The account has been removed from the system.',
      );

    throw new BadRequestException('Account already exists in the system.');
  }

  /**
   * Sign up with token
   * @param data
   */
  async signupWithToken(data: CreateUserDto) {
    // check email
    const userExist = await this.userService.findUserExist({
      email: data.email,
    });

    if (!userExist) {
      const token = await this.tokenService.generateSignupToken(data);

      const verificationLink = `http://localhost:8888/auth/verify-signup-token?token=${token}`;

      // send mail
      await this.mailService.sendSignupToken(
        verificationLink,
        data.email,
        'Register account.',
      );

      return verificationLink;
    }

    // check user deleted
    if (userExist.deleted)
      throw new BadRequestException(
        'The account has been removed from the system.',
      );

    throw new BadRequestException('Account already exists in the system.');
  }

  /**
   * Activation account
   * @param token
   * @return
   */
  async activateAccountByToken(token: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, deviceID, iat, exp, ...rest } =
      await this.tokenService.verifySignupToken(token);

    const userExist = await this.userService.findUserExist({ email });

    // check user hasn't exist
    if (!userExist) {
      // new user
      const user = await this.userService.create({
        email,
        ...rest,
        deviceID: deviceID || '',
        fcmTokens: deviceID ? [deviceID] : [],
      });

      // generate tokens
      const tokens = await this.generateAuthTokens({
        _id: user._id,
        role: user.role,
      });

      // success
      return { user, tokens };
    }

    // check user deleted
    if (userExist.deleted)
      throw new BadRequestException(
        'The account has been removed from the system.',
      );

    throw new BadRequestException('Account already exists in the system.');
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
   * @param payload
   * @returns
   */
  async generateAuthTokens(payload: TokenPayload): Promise<AuthTokenPayload> {
    // Generate ac_token and rf_token
    const [ac_token, rf_token] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    return { ac_token, rf_token };
  }
}
