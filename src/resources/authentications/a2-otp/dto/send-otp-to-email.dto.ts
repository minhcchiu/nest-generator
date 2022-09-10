import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpToEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
