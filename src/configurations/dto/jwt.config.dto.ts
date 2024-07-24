import { IsNotEmpty, IsString } from "class-validator";

export class JWTConfigDto {
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRATION: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_EXPIRATION: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_EXPIRATION: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_SIGNUP_EXPIRATION: string;

  @IsNotEmpty()
  @IsString()
  JWT_SIGNUP_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_RESET_PASSWORD_EXPIRATION: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET_FORGOT_PASSWORD: string;
}
