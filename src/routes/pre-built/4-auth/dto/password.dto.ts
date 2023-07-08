import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

import { PartialType } from "@nestjs/swagger";

import { TokenDto } from "./token.dto";

export class ResetPasswordDto extends PartialType(TokenDto) {
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	password: string;
}
