import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

import {
  SendOtpToPhoneDto,
  SendOtpToEmailDto,
  VerifyOtpEmailDto,
  VerifyOtpPhoneDto,
} from './dto';
import { BaseService } from '~base-inherit/base.service';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { PhoneHelper } from 'src/utils/helper/phone.helper';
import { MailService } from '~lazy-modules/mail/mail.service';
import { FilterVerifyOtpDto } from './dto/filter-verify-otp.dto';
import { UserService } from '~common/c1-users/user.service';

@Injectable()
export class OtpService extends BaseService<OtpDocument> {
  private otpModel: PaginateModel<OtpDocument>;
  constructor(
    @InjectModel(Otp.name) model: PaginateModel<OtpDocument>,
    private mailService: MailService,
    private userService: UserService,
  ) {
    super(model);
    this.otpModel = model;
  }

  /**
   * Send opt by email
   * @param email
   * @returns
   */
  async sendOtpToEmail({
    email,
  }: SendOtpToEmailDto): Promise<OtpDocument | string> {
    // check email exist
    const otp = await this.refreshOtpByEmail(email);

    if (otp) return otp;

    // send otp to email
    const otpCode = this.generateOTPCode();
    await this.sendEmailVerify(email, otpCode);

    // create new otp doc
    // FIXME [PRODUCTION]: Remove comment
    // return this.otpRepository.create({ email, otpCode });

    // FIXME [DEVELOPMENT]: comment
    await this.create({ email, otpCode });
    return otpCode;
  }

  /**
   * Send otp by phone
   * @param data
   * @returns
   */
  async sendOtpToPhone(data: SendOtpToPhoneDto) {
    const { zipCode, phone, country } = data;

    // validate phone number
    PhoneHelper.validatePhone(phone, zipCode, country);

    // Check can refresh otp
    const otpRefresh = await this.refreshOtpByPhone(phone);

    if (otpRefresh) return otpRefresh;

    // send otp to phone number
    const otpCode = this.generateOTPCode();
    // await this.sendPhoneVerify(phone, otpCode);

    // create new otp doc
    // FIXME [PRODUCTION]: Remove comment
    // return this.otpRepository.create({ ...data, otpCode });

    // FIXME [DEVELOPMENT]: comment
    await this.create({ ...data, otpCode });
    return otpCode;
  }

  /**
   * Refresh otp by phone
   * @param phone: string
   * @returns OtpDocument
   */
  async refreshOtpByPhone(phone: string): Promise<OtpDocument | null | string> {
    const otpDoc = await this.otpModel.findOne({ phone });

    if (!otpDoc) return null;

    // check time send otp
    const MAXIMUN_SECOND_SEND_OTP = 10;
    this.validateTimeSendOtp((<any>otpDoc).updatedAt, MAXIMUN_SECOND_SEND_OTP);

    // update otpCode
    const otpCode = this.generateOTPCode();

    // Send otp to phone
    // await this.sendPhoneVerify(phone, otpCode);

    // save
    // FIXME [PRODUCTION]: Remove comment
    otpDoc.otpCode = otpCode;
    // return otpDoc.save();

    // FIXME [DEVELOPMENT]: Comment
    await otpDoc.save();
    return otpCode;
  }

  /**
   * Refresh otp by email
   * @param email: email
   * @returns OtpDocument
   */
  async refreshOtpByEmail(email: string): Promise<OtpDocument | null | string> {
    const otpDoc = await this.otpModel.findOne({ email });

    if (!otpDoc) return null;

    // generate otpCode
    const otpCode = this.generateOTPCode();

    // send otp to email
    await this.sendEmailVerify(email, otpCode);

    // save
    // FIXME [PRODUCTION]: remove comment
    otpDoc.otpCode = otpCode;
    // return otpDoc.save();

    // FIXME [DEVELOPMENT]: comment
    await otpDoc.save();
    return otpCode;
  }

  /**
   * Verify otp
   * @param filter
   * @param otpCode
   */
  async verifyOtp(filter: FilterVerifyOtpDto, otpCode: string) {
    const otpDoc = await this.otpModel.findOne(filter);

    // check expired otp
    if (!otpDoc)
      throw new BadRequestException('Phone does not exist or OTP has expired!');

    // Check is valid otpCode
    const isValidOtpCode = await otpDoc.compareOtpCode(otpCode);

    if (!isValidOtpCode) throw new BadRequestException('Invalid otp code.');

    // delete otp doc
    const deletedOpt = await this.deleteById(otpDoc._id);

    return deletedOpt;
  }

  /**
   * Send otp to phone
   * @param phone: string
   * @param otp: string
   * @returns Promise<Otp>
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
   * @param email: string
   * @param otp: string
   * @returns Promise<Otp>
   */
  private async sendEmailVerify(email: string, otp: string): Promise<boolean> {
    // TODO: Implement send OTP service
    // call api sent otp to phone
    await this.mailService.sendOTP(otp, email, 'Verify OTP');

    return true;
  }

  /**
   * Verify otp by phone
   * @param data VerifyOtpPhoneDto
   * @returns Promise<OtpDocument>
   */
  async verifyOtpPhone(data: VerifyOtpPhoneDto): Promise<OtpDocument> {
    const { otpCode, phone } = data;

    // validate phone
    PhoneHelper.validatePhone(phone);

    const otpDoc = await this.otpModel.findOne({ phone });

    // check expired otp
    if (!otpDoc)
      throw new BadRequestException('Phone does not exist or OTP has expired!');

    // Check is valid otpCode
    const isValidOtpCode = await otpDoc.compareOtpCode(otpCode);

    if (!isValidOtpCode) throw new BadRequestException('Invalid otp code.');

    // delete otp doc
    const deletedOpt = await this.deleteOne({
      phone: otpDoc.phone,
    });

    return deletedOpt;
  }

  /**
   * Verify otp by email
   * @param data VerifyOtpEmailDto
   * @returns Promise<OtpDocument>
   */
  async verifyOtpEmail(data: VerifyOtpEmailDto): Promise<OtpDocument> {
    const { email, otpCode } = data;
    const otpDoc = await this.otpModel.findOne({ email });

    // check expired otp
    if (!otpDoc)
      throw new BadRequestException('Email does not exist or OTP has expired!');

    // check is valid otpCode
    const isValidOtpCode = await otpDoc.compareOtpCode(otpCode);

    if (!isValidOtpCode) throw new BadRequestException('Invalid otp code.');

    // delete otp doc
    const deletedOpt = await this.deleteOne({ email });
    return deletedOpt;
  }

  /**
   * generate otp code
   * @returns String
   */
  private generateOTPCode(length = 4) {
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
   * @param updatedAt datetime
   * @param maximunSecond number
   * @returns Boolean
   */
  private validateTimeSendOtp(updatedAt: string, maximunSecond = 30) {
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
