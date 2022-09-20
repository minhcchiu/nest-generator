import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { OtpType } from '../enum/otp-type.enum';

export class VerifyOtpDto {
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  @IsString()
  phone?: string;

  @ValidateIf((o) => !o.phone)
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  otpType: OtpType;

  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
