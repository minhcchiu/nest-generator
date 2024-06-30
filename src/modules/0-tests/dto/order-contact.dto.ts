import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OrderContactDto {
	@IsNotEmpty()
	@IsString()
	fullName: string;

	@IsNotEmpty()
	@IsString()
	phone: string;

	@IsOptional()
	@IsEmail()
	email: string;
}
