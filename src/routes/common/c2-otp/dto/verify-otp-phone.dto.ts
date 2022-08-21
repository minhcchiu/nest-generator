import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpPhoneDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
