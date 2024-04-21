import { OmitType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty } from "class-validator";
import { RegisterDto } from "./register.dto";
export class SendRegisterTokenDto extends OmitType(RegisterDto, ["email"]) {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;
}
