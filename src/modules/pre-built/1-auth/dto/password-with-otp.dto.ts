import { PartialType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";
import { VerifyOtpDto } from "~modules/pre-built/6-otp/dto/verify-otp.dto";

export class ResetPasswordWithOtpDto extends PartialType(VerifyOtpDto) {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsNotEmpty()
  @Length(4)
  @IsNumberString()
  otpCode: string;

  @IsOptional()
  @IsBoolean()
  isLogoutOthers?: boolean;
}
