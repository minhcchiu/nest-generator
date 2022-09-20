import { IsNotEmpty } from 'class-validator';

export class SendOtpToPhoneDto {
  @IsNotEmpty()
  phone: string;
}
