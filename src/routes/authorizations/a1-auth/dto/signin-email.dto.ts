import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class SigninEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 50)
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
