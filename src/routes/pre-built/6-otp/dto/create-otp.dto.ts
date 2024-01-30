import { IsEmail, IsEnum, IsNotEmpty, ValidateIf } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { OtpType } from "../enums/otp-type";

export class CreateOtpDto {
	@ApiProperty({ description: "User phone number", required: false })
	@ValidateIf((o) => !o.email)
	@IsNotEmpty()
	readonly phone: string;

	@ApiProperty({ description: "User email address", required: false })
	@ValidateIf((o) => !o.phone)
	@IsEmail()
	readonly email: string;

	@ApiProperty({ enum: OtpType, description: "Type of OTP to be generated" })
	@IsNotEmpty()
	@IsEnum(OtpType)
	otpType: OtpType;
}
