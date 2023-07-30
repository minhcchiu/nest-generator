import { CreateUserDto } from "~pre-built/1-users/dto/create-user.dto";

import { PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class LoginWithSocialDto extends PartialType(
	PickType(CreateUserDto, [
		"accountType",
		"dateOfBirth",
		"fullName",
		"gender",
		"avatar",
	] as const),
) {
	@IsNotEmpty()
	@IsString()
	socialToken: string;

	@IsNotEmpty()
	@IsString()
	@Length(10, 80)
	socialID: string;

	@IsOptional()
	@IsString()
	deviceID?: string;
}
