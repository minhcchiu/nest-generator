import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { TokenDto } from "./token.dto";

export class ResetPasswordWithTokenDto extends PartialType(TokenDto) {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsOptional()
  @IsBoolean()
  isLogoutOthers?: boolean;

  @IsOptional()
  @IsString()
  fcmToken?: string;
}
