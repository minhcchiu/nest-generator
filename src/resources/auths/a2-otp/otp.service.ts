import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { BaseService } from '~base-inherit/base.service';
import { UserService } from '~common/c1-users/user.service';
import { MailService } from '~lazy-modules/mail/mail.service';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { ConfigService } from '@nestjs/config';
import { OtpConfig } from '~config/enviroment/otp.env';
import { SendOtpDto } from './dto/send-otp.dto copy';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpType } from './enum/otp-type.enum';
import { AppConfig } from '~config/enviroment';
import { appEnvEnum } from '~config/enviroment/enums/app_env.enum';

@Injectable()
export class OtpService extends BaseService<OtpDocument> {
  private otpModel: PaginateModel<OtpDocument>;
  private optConfig: OtpConfig;
  private appConfig: AppConfig;

  constructor(
    @InjectModel(Otp.name) model: PaginateModel<OtpDocument>,
    private mailService: MailService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super(model);

    this.otpModel = model;
    this.optConfig = this.configService.get<OtpConfig>('otp');
    this.appConfig = this.configService.get<AppConfig>('app');
  }

  /**
   * Send otp to email/phone
   *
   * @param { otpType, phone, email }
   * @return
   */
  async sendOtp({ otpType, phone, email }: SendOtpDto) {
    if (phone) return this._sendOtpToPhone(phone, otpType);

    return this._sendOtpToEmail(email, otpType);
  }

  /**
   * Send otp signup to email/phone
   *
   * @param {phone, email}
   * @return
   */
  async sendOtpSignup({ phone, email }: SendOtpDto) {
    const filter = phone ? { phone } : { email };

    await this.userService.validateCreateUser(filter);

    if (phone) return this._sendOtpToPhone(phone, OtpType.SIGNUP);

    return this._sendOtpToEmail(email, OtpType.SIGNUP);
  }

  /**
   * Verify otp
   *
   * @param {phone, email, otpCode}
   * @return
   */
  async verifyOtp({ email, phone, otpCode, otpType }: VerifyOtpDto) {
    const filter = phone ? { phone, otpType } : { email, otpType };

    // find otpDoc
    const otpDoc = await this.otpModel.findOne(filter);

    // check expired otp
    if (!otpDoc)
      throw new BadRequestException('OTP does not exist or has expired!');

    // Check is valid otpCode
    const isValidOtpCode = await otpDoc.compareOtpCode(otpCode);

    if (isValidOtpCode) return this.deleteById(otpDoc._id);

    throw new BadRequestException('Invalid otp code.');
  }

  /**
   * Send opt by email
   *
   * @param email
   * @returns
   */
  private async _sendOtpToEmail(email: string, otpType = OtpType.EMAIL) {
    // check email exist
    const otp = await this._refreshOtpByEmail(email);

    if (otp) return otp;

    // send otp to email
    const otpCode = this._generateOTPCode();
    await this._sendEmailVerify(email, otpCode);

    // Reponse otp
    if (this.appConfig.env === appEnvEnum.DEVELOPMENT) {
      await this.create({ email, otpCode, otpType });
      return { otpCode };
    }

    return this.create({ email, otpCode, otpType });
  }

  /**
   * Send otp by phone
   *
   * @param phone
   * @returns
   */
  private async _sendOtpToPhone(phone: string, otpType = OtpType.PHONE) {
    // Check can refresh otp
    const otpRefresh = await this._refreshOtpByPhone(phone, otpType);

    if (otpRefresh) return otpRefresh;

    // send otp to phone number
    const otpCode = this._generateOTPCode();
    // await this.sendPhoneVerify(phone, otpCode);

    // Reponse otp
    if (this.appConfig.env === appEnvEnum.DEVELOPMENT) {
      await this.create({ phone, otpCode, otpType });
      return { otpCode };
    }

    return this.create({ phone, otpCode, otpType });
  }

  /**
   * Refresh otp by phone
   *
   * @param phone
   * @returns
   */
  private async _refreshOtpByPhone(phone: string, otpType = OtpType.PHONE) {
    const otpDoc = await this.otpModel.findOne({ phone, otpType });

    if (!otpDoc) return null;

    // check time send otp
    const { maximunSecondSendOtp } = this.optConfig;

    this._validateTimeSendOtp((<any>otpDoc).updatedAt, maximunSecondSendOtp);

    // update otpCode
    const otpCode = this._generateOTPCode();

    // save
    if (this.appConfig.env === appEnvEnum.PRODUCTION) {
      otpDoc.otpCode = otpCode;
      otpDoc.otpType = otpType;

      return otpDoc.save();
    }

    await otpDoc.save();
    return { otpCode };
  }

  /**
   * Refresh otp by email
   *
   * @param email
   * @returns
   */
  private async _refreshOtpByEmail(email: string, otpType = OtpType.EMAIL) {
    const otpDoc = await this.otpModel.findOne({ email, otpType });

    if (!otpDoc) return null;

    // generate otpCode
    const otpCode = this._generateOTPCode();

    // send otp to email
    await this._sendEmailVerify(email, otpCode);

    // save
    if (this.appConfig.env === appEnvEnum.PRODUCTION) {
      otpDoc.otpCode = otpCode;
      otpDoc.otpType = otpType;

      return otpDoc.save();
    }

    await otpDoc.save();
    return { otpCode };
  }

  /**
   * Send otp to phone
   *
   * @param phone
   * @param otp
   * @returns
   */
  // private async sendPhoneVerify(
  //   phone: string,
  //   otp: string,
  // ): Promise<Otp | null> {
  // TODO: Implement send OTP service
  // call api sent otp to phone
  //
  //   return null;
  // }

  /**
   * Send otp to email
   *
   * @param email
   * @param otp
   * @returns
   */
  private async _sendEmailVerify(email: string, otp: string): Promise<boolean> {
    return this.mailService.sendOTP(otp, email, 'Verify OTP');
  }

  /**
   * Generate otp code
   *
   * @returns
   */
  private _generateOTPCode(length = 4) {
    const digits = '0123456789';

    let otp = '';

    for (let i = 1; i <= length; i++) {
      const index = Math.floor(Math.random() * digits.length);

      otp = otp + digits[index];
    }

    return otp;
  }

  /**
   * Validate time send otp
   *
   * @param updatedAt
   * @param maximunSecond
   * @returns
   */
  private _validateTimeSendOtp(updatedAt: string, maximunSecond = 30) {
    const secondsLeft = dayjs().diff(dayjs(updatedAt), 'second');
    const isValidTime = secondsLeft < maximunSecond;

    if (isValidTime) {
      throw new BadRequestException(
        `Please try again in ${maximunSecond - secondsLeft} seconds`,
      );
    }

    return isValidTime;
  }
}
