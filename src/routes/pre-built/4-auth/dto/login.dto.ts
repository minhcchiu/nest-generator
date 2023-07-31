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
	@ValidateIf((o) => !(o.phone || o.email))
	@IsString()
	username: string;

	@ValidateIf((o) => !(o.username || o.phone))
	@IsEmail()
	readonly email?: string;

	@ValidateIf((o) => !(o.email || o.username))
	@IsString()
	@MinLength(10)
	@MaxLength(15)
	readonly phone?: string;

	@IsNotEmpty()
	@Length(6, 50)
	@IsString()
	readonly password: string;

	@IsOptional()
	@IsString()
	deviceID?: string;
}
