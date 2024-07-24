import { IsOptional, IsString } from "class-validator";

export class CreateSettingDto {
  @IsOptional()
  @IsString()
  logoUrl: string;

  @IsOptional()
  @IsString()
  appName: string;

  @IsOptional()
  @IsString()
  termsOfUse: string;

  @IsOptional()
  @IsString()
  privacyPolicy: string;
}
