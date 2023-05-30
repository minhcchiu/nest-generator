import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateOtpDto } from './create-otp.dto';

export class VerifyOtpDto extends PartialType(CreateOtpDto) {
  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
