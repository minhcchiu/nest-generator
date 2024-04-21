import { PickType } from "@nestjs/mapped-types";
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

export class RegisterDto extends PickType(CreateUserDto, [
	"username",
	"phone",
	"email",
	"password",
	"fullName",
	"dateOfBirth",
	"gender",
	"avatar",
] as const) {
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

	@IsOptional()
	@IsString()
	fcmToken?: string;

	password: string;

	fullName: string;

	@IsOptional()
	@IsNumber()
	dateOfBirth?: number;

	@IsOptional()
	@IsEnum(GenderEnum)
	gender?: GenderEnum;

	@IsOptional()
	@IsString()
	avatar?: string;
}
