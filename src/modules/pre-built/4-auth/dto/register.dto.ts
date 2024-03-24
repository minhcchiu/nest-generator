import {
	IsEmail,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf,
} from "class-validator";
import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";
import { GenderEnum } from "~pre-built/1-users/enums/gender.enum";

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
	@ApiPropertyOptional({ default: "user" })
	@ValidateIf((o) => [o.phone, o.email, o.idToken].length < 0)
	@IsString()
	username: string;

	@ApiPropertyOptional({ default: "user@gmail.com" })
	@ValidateIf((o) => [o.username, o.phone, o.idToken].length < 0)
	@IsEmail()
	readonly email?: string;

	@ApiPropertyOptional({ default: "0387776243" })
	@ValidateIf((o) => [o.username, o.email, o.idToken].length < 0)
	@IsString()
	@MinLength(10)
	@MaxLength(15)
	readonly phone?: string;

	@ApiPropertyOptional({ default: null })
	@IsOptional()
	@IsString()
	fcmToken?: string;

	@ApiProperty({ default: "User@123" })
	password: string;

	@ApiProperty({ default: "User" })
	fullName: string;

	@ApiPropertyOptional({ default: 984528000000 })
	@IsOptional()
	@IsNumber()
	dateOfBirth?: number;

	@ApiProperty({ enum: GenderEnum, default: GenderEnum.MALE })
	@IsOptional()
	@IsEnum(GenderEnum)
	gender?: GenderEnum;

	@ApiPropertyOptional({ default: "https://ibb.co/W2nySND" })
	@IsOptional()
	@IsString()
	avatar?: string;
}
