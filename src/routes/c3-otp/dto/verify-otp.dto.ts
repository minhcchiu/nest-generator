import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthKeyType } from '~routes/auth/enums/auth-key.enum';
import { OtpType } from '../enum/otp-type.enum';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyType)
  @IsString({ each: true })
  readonly authKey: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  otpType: OtpType;

  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
