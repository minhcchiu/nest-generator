import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SigninDto {
  @ValidateIf((object) => !object.phone)
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ValidateIf((object) => !object.email)
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  readonly phone: string;

  @IsNotEmpty()
  @Length(6, 50)
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
