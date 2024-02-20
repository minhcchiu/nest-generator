import { IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateProvinceDto {
	@ApiProperty({ description: "Name of the province" })
	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
