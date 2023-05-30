import { IsEmail, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { OtpType } from '../enums/otp-type';

export class CreateOtpDto {
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  readonly phone: string;

  @ValidateIf((o) => !o.email)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  otpType: OtpType;
}
