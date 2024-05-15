import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";

export class SocialLoginDto extends PickType(CreateUserDto, [
	"accountType",
] as const) {
	@IsNotEmpty()
	@IsString()
	idToken: string;

	@IsOptional()
	@IsString()
	fcmToken?: string;
}
