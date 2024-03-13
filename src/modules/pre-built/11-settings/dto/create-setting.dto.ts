import { IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateSettingDto {
	@ApiProperty({ required: false, description: "URL for the logo" })
	@IsOptional()
	@IsString()
	logoUrl: string;

	@ApiProperty({ required: false, description: "Name of the application" })
	@IsOptional()
	@IsString()
	appName: string;

	@ApiProperty({
		required: false,
		description: "Terms of use for the application",
	})
	@IsOptional()
	@IsString()
	termsOfUse: string;

	@ApiProperty({
		required: false,
		description: "Privacy policy for the application",
	})
	@IsOptional()
	@IsString()
	privacyPolicy: string;
}
