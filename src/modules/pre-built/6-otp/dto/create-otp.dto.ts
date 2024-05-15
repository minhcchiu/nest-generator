import { IsEmail, IsEnum, IsNotEmpty, ValidateIf } from "class-validator";
import { OtpTypeEnum } from "../enums/otp-type.enum";
import { SendOtpToEnum } from "../enums/send-otp-to";
export class CreateOtpDto {
	@ValidateIf((o) => !o.email)
	@IsNotEmpty()
	readonly phone?: string;

	@ValidateIf((o) => !o.phone)
	@IsEmail()
	readonly email?: string;

	@IsNotEmpty()
	@IsEnum(SendOtpToEnum)
	readonly sendOtpTo: SendOtpToEnum;

	@IsNotEmpty()
	@IsEnum(OtpTypeEnum)
	otpType: OtpTypeEnum;
}
