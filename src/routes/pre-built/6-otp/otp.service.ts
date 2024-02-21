import dayjs from "dayjs";
import { FilterQuery, Model, QueryOptions } from "mongoose";
import { generateOTP } from "~helpers/generate-otp";
import { MailService } from "~shared/mail/mail.service";

import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";

import { CreateOtpDto } from "./dto/create-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { OtpType } from "./enums/otp-type";
import { Otp } from "./schemas/otp.schema";
import {
	AppConfig,
	NodeEnv,
	appConfigName,
} from "~config/environment/app.config";
import { OtpConfig, otpConfigName } from "~config/environment/otp.config";

@Injectable()
export class OtpService {
	private otpConfig: OtpConfig;
	private appConfig: AppConfig;

	constructor(
		@InjectModel(Otp.name) private otpModel: Model<Otp>,
		private mailService: MailService,
		private configService: ConfigService,
	) {
		this.otpConfig = this.configService.get<OtpConfig>(otpConfigName);
		this.appConfig = this.configService.get<AppConfig>(appConfigName);
	}

	async sendOtp({ otpType, ...credential }: CreateOtpDto) {
		const { otpCode } = await this.create(credential, otpType);

		// send verify
		if (credential.phone)
			await this._sendPhoneVerify(credential.phone, otpCode);
		else if (credential.email)
			await this._sendEmailVerify(credential.email, otpCode);

		const { nodeEnv } = this.appConfig;

		if (nodeEnv === NodeEnv.Development) return { otpCode, otpType };

		return {
			message: `OTP code has been successfully sent to the ${credential}.`,
		};
	}

	async verifyOtp({ otpCode, otpType, ...credential }: VerifyOtpDto) {
		const otpDoc = await this.otpModel.findOne({
			...credential,
			otpType,
		});

		if (!otpDoc) throw new NotFoundException("OTP does not exist.");

		const currentTimestamp = Date.now();
		if (otpDoc.expiredAt > currentTimestamp)
			throw new UnauthorizedException("The OTP has expired!");

		const isValidOtpCode = await otpDoc.compareOtpCode(otpCode);

		if (isValidOtpCode) return this.otpModel.findByIdAndDelete(otpDoc._id);

		throw new BadRequestException("Invalid otp code.");
	}

	private async create(credential: any, otpType: OtpType) {
		const { expiresIn } = this.otpConfig;

		const otpCode = generateOTP();
		const expiredAt = Date.now() + expiresIn;

		const otpDoc = await this.otpModel.findOne({
			...credential,
			otpCode,
			otpType,
		});

		if (otpDoc) {
			otpDoc.otpCode = otpCode;
			otpDoc.expiredAt = expiredAt;

			// validate re-send otp
			this._validateTimeResendOtp(otpDoc["updatedAt"]);

			await otpDoc.save();
		} else {
			await this.otpModel.create({
				...credential,
				otpCode,
				otpType,
				expiredAt,
			});
		}

		return { otpCode, otpType };
	}

	private async _sendPhoneVerify(phone: string, otp: string): Promise<boolean> {
		// TODO: Implement sending OTP to the phone.
		return !!(phone && otp);
	}

	private async _sendEmailVerify(email: string, otp: string): Promise<boolean> {
		return this.mailService.sendOTP(otp, email, "Verify OTP");
	}

	/**
	 * Validate time re-send otp
	 *
	 * @param updatedAt
	 * @returns
	 */
	private _validateTimeResendOtp(updatedAt: string) {
		const secondsLeft = dayjs().diff(dayjs(updatedAt), "second");
		const isValidTime = secondsLeft < 10;

		if (isValidTime) {
			throw new BadRequestException(
				`Please try again in ${10 - secondsLeft} seconds`,
			);
		}

		return isValidTime;
	}

	/**
	 * Find all
	 *
	 * @param filter
	 * @param options
	 * @returns
	 */
	findMany(filter: FilterQuery<Otp>, options?: QueryOptions<Otp>) {
		return this.otpModel.find(filter, options?.projection, options).lean();
	}
}
