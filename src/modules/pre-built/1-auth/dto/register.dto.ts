import { PickType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { SendOtpToEnum } from "~modules/pre-built/6-otp/enums/send-otp-to";
import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";

export class RegisterDto extends PickType(CreateUserDto, [
	"username",
	"phone",
	"email",
	"password",
	"fullName",
	"dateBirth",
	"gender",
	"avatar",
	"accountType",
	"status",
] as const) {
	@IsOptional()
	@IsString()
	fcmToken?: string;

	@IsOptional()
	@IsString()
	otpCode?: string;

	@IsOptional()
	@IsEnum(SendOtpToEnum)
	sendOtpTo?: SendOtpToEnum;
}
