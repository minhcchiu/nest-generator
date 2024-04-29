import { PickType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";

export class RegisterDto extends PickType(CreateUserDto, [
	"username",
	"phone",
	"email",
	"password",
	"fullName",
	"dateBirth",
	"gender",
	"avatar",
	"accountType",
] as const) {
	@IsOptional()
	@IsString()
	fcmToken?: string;
}
