import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MaxLength,
	MinLength,
	ValidateIf,
} from "class-validator";

export class LoginDto {
	@ApiPropertyOptional({ default: "usertest1" })
	@ValidateIf((o) => !o.phone && !o.email)
	@IsString()
	username: string;

	@ValidateIf((o) => !o.username && !o.phone)
	@IsEmail()
	readonly email?: string;

	@ValidateIf((o) => !o.username && !o.email)
	@IsString()
	@MinLength(10)
	@MaxLength(15)
	readonly phone?: string;

	@ApiProperty({ default: "Usertest1@123" })
	@IsNotEmpty()
	@Length(6, 50)
	@IsString()
	readonly password: string;

	@ApiPropertyOptional({ default: null })
	@IsOptional()
	@IsString()
	deviceID?: string;
}
