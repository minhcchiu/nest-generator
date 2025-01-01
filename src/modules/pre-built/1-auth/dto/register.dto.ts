import { PickType } from "@nestjs/mapped-types";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { OtpTypeEnum } from "~modules/pre-built/6-otp/enums/otp-type.enum";
import { SendOtpToEnum } from "~modules/pre-built/6-otp/enums/send-otp-to";
import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";

export class RegisterDto extends PickType(CreateUserDto, [
  "username",
  "phone",
  "email",
  "password",
  "fullName",
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

  @IsNotEmpty()
  @IsBoolean()
  acceptTerms: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(OtpTypeEnum)
  otpType?: OtpTypeEnum;

  @IsOptional()
  @IsEnum(SendOtpToEnum)
  sendOtpTo?: SendOtpToEnum;
}
