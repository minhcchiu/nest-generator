import { IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class TokenDto {
	@ApiProperty({ description: "The token string" })
	@IsNotEmpty()
	@IsString()
	token: string;
}
