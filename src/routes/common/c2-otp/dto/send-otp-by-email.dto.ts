import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpByEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
