import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { TokenDto } from "~modules/pre-built/1-auth/dto/token.dto";

export class ResetPasswordDto extends PartialType(TokenDto) {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
