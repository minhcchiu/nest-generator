import { IsEmail, IsNotEmpty } from "class-validator";

import { OmitType, PartialType } from "@nestjs/swagger";

import { RegisterDto } from "./register.dto";

export class SendRegisterTokenDto extends PartialType(
	OmitType(RegisterDto, ["email"]),
) {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;
}
