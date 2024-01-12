import dayjs from "dayjs";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Otp } from "./schemas/otp.schema";
import { FilterQuery, Model, QueryOptions } from "mongoose";
import { MailService } from "~shared/mail/mail.service";
import { CreateOtpDto } from "./dto/create-otp.dto";
import { OtpType } from "./enums/otp-type";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { generateOTP } from "~helpers/generate-otp";
import { AppConfig, OtpConfig } from "~config/interfaces/config.interface";
import { ConfigName, NodeEnv } from "~config/enums/config.enum";

@Injectable()
export class OtpService {
	constructor(
		@InjectModel(Otp.name) private otpModel: Model<Otp>,
		private mailService: MailService,
		private configService: ConfigService,
	) {}

	async sendOtp({ otpType, ...credential }: CreateOtpDto) {
		const { otpCode } = await this.create(credential, otpType);

		// send verify
		if (credential.phone)
			await this._sendPhoneVerify(credential.phone, otpCode);
		else if (credential.email)
			await this._sendEmailVerify(credential.email, otpCode);

		const { nodeEnv } = this.configService.get<AppConfig>(ConfigName.App);

		if (nodeEnv === NodeEnv.DEVELOPMENT) return { otpCode, otpType };

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
		const { expiresIn } = this.configService.get<OtpConfig>(ConfigName.Otp);

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
	findAll(filter: FilterQuery<Otp>, options?: QueryOptions<Otp>) {
		return this.otpModel.find(filter, options?.projection, options).lean();
	}
}
