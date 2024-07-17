import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  authKey: string;

  @IsNotEmpty()
  @Length(6, 50)
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  fcmToken?: string;
}
