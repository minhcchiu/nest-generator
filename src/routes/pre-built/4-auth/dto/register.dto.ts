import {
	IsEmail,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf,
} from "class-validator";
import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";
import { GenderEnum } from "~routes/pre-built/1-users/enums/gender.enum";

import {
	ApiProperty,
	ApiPropertyOptional,
	PartialType,
	PickType,
} from "@nestjs/swagger";

export class RegisterDto extends PartialType(
	PickType(CreateUserDto, [
		"username",
		"phone",
		"email",
		"password",
		"fullName",
		"dateOfBirth",
		"gender",
		"avatar",
	] as const),
) {
	@ApiPropertyOptional({ default: "username" })
	@ValidateIf((o) => [o.phone, o.email, o.idToken].length < 0)
	@IsString()
	username: string;

	@ValidateIf((o) => [o.username, o.phone, o.idToken].length < 0)
	@IsEmail()
	readonly email?: string;

	@ValidateIf((o) => [o.username, o.email, o.idToken].length < 0)
	@IsString()
	@MinLength(10)
	@MaxLength(15)
	readonly phone?: string;

	@ValidateIf((o) => [o.username, o.phone, o.email].length < 0)
	@IsString()
	@MinLength(10)
	@MaxLength(15)
	readonly idToken?: string;

	@ApiPropertyOptional({ default: null })
	@IsOptional()
	@IsString()
	deviceID?: string;

	@ApiProperty({ default: "Usertest1@123" })
	password: string;

	@ApiProperty({ default: "User Test1" })
	fullName: string;

	@ApiPropertyOptional({ default: 984528000000 })
	dateOfBirth: number;

	@ApiProperty({ enum: GenderEnum, default: GenderEnum.MALE })
	gender: GenderEnum;

	@ApiPropertyOptional({ default: "https://ibb.co/W2nySND" })
	avatar: string;
}
