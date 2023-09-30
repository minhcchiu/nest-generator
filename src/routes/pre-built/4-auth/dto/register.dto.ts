import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";

import {
	ApiProperty,
	ApiPropertyOptional,
	PartialType,
	PickType,
} from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GenderEnum } from "~routes/pre-built/1-users/enums/gender.enum";

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
	@ApiPropertyOptional({ default: null })
	@IsOptional()
	@IsString()
	deviceID?: string;

	@ApiPropertyOptional({ default: "usertest1" })
	username?: string;

	@ApiPropertyOptional({ default: "0387776243" })
	phone?: string;

	@ApiPropertyOptional({ default: "usertest1@gmail.com" })
	email?: string;

	@ApiProperty({ default: "Usertest1@123" })
	password: string;

	@ApiProperty({ default: "User Test1" })
	fullName: string;

	@ApiPropertyOptional({ default: "2001-03-14T00:00:00.000Z" })
	dateOfBirth: Date;

	@ApiProperty({ enum: GenderEnum, default: GenderEnum.MALE })
	gender: GenderEnum;

	@ApiPropertyOptional({ default: "https://ibb.co/W2nySND" })
	avatar: string;
}
