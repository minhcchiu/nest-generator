import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsNotEmpty } from "class-validator";
import { SendOtpToEnum } from "~modules/pre-built/6-otp/enums/send-otp-to";
import { RegisterDto } from "./register.dto";

export class SendRegisterTokenDto extends PartialType(RegisterDto) {
	@IsNotEmpty()
	@IsEnum(SendOtpToEnum)
	sendOtpTo: SendOtpToEnum;
}
