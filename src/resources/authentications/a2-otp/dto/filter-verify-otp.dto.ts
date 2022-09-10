import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';

export class FilterVerifyOtpDto {
  @ValidateIf((object) => !object.phone)
  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;

  @ValidateIf((object) => !object.email)
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  readonly phone?: string;
}
