import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
	@ApiPropertyOptional({ default: "user@gmail.com" })
	@IsNotEmpty()
	@IsString()
	authKey: string;

	@ApiProperty({ default: "User@123" })
	@IsNotEmpty()
	@Length(6, 50)
	@IsString()
	readonly password: string;

	@ApiPropertyOptional({ default: null })
	@IsOptional()
	@IsString()
	fcmToken?: string;
}
