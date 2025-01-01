import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  fcmToken?: string;
}
