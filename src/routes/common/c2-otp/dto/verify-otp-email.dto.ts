import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
