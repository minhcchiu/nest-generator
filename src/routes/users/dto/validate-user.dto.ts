import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class ValidateUserDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  authKey?: string;
}
