import { IsNotEmpty, Length } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(6, 50)
	oldPassword: string;

	@ApiProperty()
	@IsNotEmpty()
	@Length(6, 50)
	newPassword: string;
}
