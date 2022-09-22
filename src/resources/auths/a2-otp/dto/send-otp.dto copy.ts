import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { OtpType } from '../enum/otp-type.enum';

export class SendOtpDto {
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
}
