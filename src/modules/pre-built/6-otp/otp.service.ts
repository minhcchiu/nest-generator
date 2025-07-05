import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { differenceInSeconds } from "date-fns";
import { FilterQuery, Model, QueryOptions } from "mongoose";
import { NodeEnv } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/env.static";
import { generateOTP } from "~helpers/generate-otp";
import { MailService } from "~shared/mail/mail.service";
import { UserService } from "../1-users/user.service";
import { CreateOtpDto } from "./dto/create-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { OtpTypeEnum } from "./enums/otp-type.enum";
import { SendOtpToEnum } from "./enums/send-otp-to";
import { Otp } from "./schemas/otp.schema";

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async sendOtp(input: CreateOtpDto) {
    await this._validateSendOtp(input);

    const { otpCode, expiredAt } = await this._createOtp(input);

    switch (input.sendOtpTo) {
      case SendOtpToEnum.Phone:
        return this._sendPhoneVerify(input.phone, {
          otpCode,
          expiredAt,
        });

      case SendOtpToEnum.Email:
        return this._sendEmailVerify(input.email, {
          otpCode,
          expiredAt,
        });

      default:
        throw new BadRequestException("Invalid send otp to.");
    }
  }

  async verifyOtp(input: VerifyOtpDto) {
    const res = await this.checkOtpValid(input);

    return this.otpModel.findByIdAndDelete(res._id);
  }

  async checkOtpValid({ otpCode, otpType, sendOtpTo, email, phone }: VerifyOtpDto) {
    const filter = { otpType };

    if (sendOtpTo === SendOtpToEnum.Email) Object.assign(filter, { email });
    else Object.assign(filter, { phone });

    const otpDoc = await this.otpModel.findOne(filter);

    if (!otpDoc) throw new NotFoundException("OTP does not exist.");

    if (Date.now() > otpDoc.expiredAt) throw new UnauthorizedException("The OTP has expired!");

    const isValidOtpCode = await otpDoc.compareOtpCode(otpCode);

    if (isValidOtpCode) return otpDoc.toObject();

    throw new BadRequestException("Invalid otp code.");
  }

  private async _createOtp(input: CreateOtpDto) {
    const otpCode = generateOTP();
    const expiredAt = Date.now() + EnvStatic.getAppConfig().otpExpiration;

    const otpDoc = await this.otpModel.findOne({
      [input.sendOtpTo.toLowerCase()]: input[input.sendOtpTo.toLowerCase()],
      sendOtpTo: input.sendOtpTo,
      otpType: input.otpType,
    });

    if (otpDoc) {
      otpDoc.otpCode = otpCode;
      otpDoc.expiredAt = expiredAt;

      // validate re-send otp
      this._validateTimeResendOtp(otpDoc["updatedAt"]);

      await otpDoc.save();
    } else {
      await this.otpModel.create({
        ...input,
        otpCode,
        expiredAt,
      });
    }

    return {
      otpCode,
      otpType: input.otpType,
      expiredAt,
    };
  }

  findMany(filter: FilterQuery<Otp>, options?: QueryOptions<Otp>) {
    return this.otpModel.find(filter, options?.projection, options).lean();
  }

  private async _sendPhoneVerify(
    phone: string,
    data: {
      otpCode: string;
      expiredAt: number;
    },
  ) {
    // TODO: Implement sending OTP to the phone.
    return {
      phone,
      otpCode: EnvStatic.getAppConfig().nodeEnv === NodeEnv.Development ? data.otpCode : undefined,
      expiredAt: data.expiredAt,
    };
  }

  private async _sendEmailVerify(
    email: string,
    data: {
      otpCode: string;
      expiredAt: number;
    },
  ) {
    await this.mailService.sendOTP(data, email, "Verify OTP");

    return {
      email,
      otpCode: EnvStatic.getAppConfig().nodeEnv === NodeEnv.Development ? data.otpCode : undefined,
      expiredAt: data.expiredAt,
    };
  }

  /**
   * Validate time re-send otp
   *
   * @param updatedAt
   * @returns
   */
  private _validateTimeResendOtp(updatedAt: string) {
    const secondsLeft = differenceInSeconds(new Date(), new Date(updatedAt));
    const isValidTime = secondsLeft < 30;

    if (isValidTime) {
      throw new BadRequestException(`Please try again in ${30 - secondsLeft} seconds`);
    }

    return isValidTime;
  }

  private async _validateSendOtp(input: CreateOtpDto) {
    const userFilter =
      input.sendOtpTo === SendOtpToEnum.Email ? { email: input.email } : { phone: input.phone };

    switch (input.otpType) {
      case OtpTypeEnum.Register: {
        const user = await this.userService.findOne(userFilter);

        if (user)
          throw new BadRequestException(`The ${input.sendOtpTo.toLowerCase()} already exists.`);

        return true;
      }

      case OtpTypeEnum.ResetPassword: {
        const user = await this.userService.findOne(userFilter);

        if (!user)
          throw new BadRequestException(`The ${input.sendOtpTo.toLowerCase()} does not exist.`);

        return true;
      }
    }
  }
}
