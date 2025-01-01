import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { NodeEnv, StorageServerEnum } from "../enums/config.enum";

export class AppConfigDto {
  @IsNotEmpty()
  @IsEnum(NodeEnv)
  SERVER_ENV: NodeEnv;

  @IsNotEmpty()
  @IsNumber()
  SERVER_PORT: number;

  @IsNotEmpty()
  @IsString()
  SERVER_URL: string;

  @IsNotEmpty()
  @IsString()
  SERVER_NAME: string;

  @IsNotEmpty()
  @IsEnum(StorageServerEnum)
  STORAGE_SERVER: StorageServerEnum;

  @IsNotEmpty()
  @IsString()
  RESET_PASSWORD_URL: string;

  @IsNotEmpty()
  @IsString()
  VERIFY_ACCOUNT_URL: string;

  @IsNotEmpty()
  @IsString()
  OTP_EXPIRATION: string;

  @IsOptional()
  @IsString()
  SUPPER_ADMIN_LIST?: string;

  @IsNotEmpty()
  @IsString()
  GEMINI_KEY: string;

  @IsNotEmpty()
  @IsString()
  GEMINI_BASE_URL: string;
}
