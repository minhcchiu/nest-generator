import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

import { ApiProperty, PartialType } from "@nestjs/swagger";

import { TokenDto } from "./token.dto";

export class ResetPasswordDto extends PartialType(TokenDto) {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	password: string;
}
