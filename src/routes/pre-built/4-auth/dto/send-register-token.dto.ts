import { IsEmail, IsNotEmpty } from "class-validator";

import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";

import { RegisterDto } from "./register.dto";

export class SendRegisterTokenDto extends PartialType(
	OmitType(RegisterDto, ["email"]),
) {
	@ApiProperty({ description: "Email address to send the token" })
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;
}
