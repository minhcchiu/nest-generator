import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsNotEmpty,
	IsNumber,
	IsBoolean,
	IsEnum,
} from "class-validator";
import { AppTypeEnum } from "../enums/app-type.enum";

export class CreateBannerDto {
	@ApiProperty({ example: "image-url", description: "URL of the banner image" })
	@IsNotEmpty()
	@IsString()
	imageUrl: string;

	@ApiProperty({ example: "Banner Title", description: "Title of the banner" })
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty({
		example: "https://example.com",
		description: "Link associated with the banner",
	})
	@IsString()
	link: string;

	@ApiProperty({
		example: 1642828800000,
		description: "Start date of the banner in milliseconds",
	})
	@IsNumber()
	startAt: number;

	@ApiProperty({
		example: 1643472000000,
		description: "End date of the banner in milliseconds",
	})
	@IsNumber()
	endAt: number;

	@ApiProperty({ example: 1, description: "Position of the banner" })
	@IsNotEmpty()
	@IsNumber()
	position: number;

	@ApiProperty({
		example: true,
		description: "Flag indicating if the banner is active",
	})
	@IsBoolean()
	isActive: boolean;

	@ApiProperty({
		example: AppTypeEnum.Customer,
		enum: AppTypeEnum,
		description: "Type of the application",
	})
	@IsNotEmpty()
	@IsEnum(AppTypeEnum)
	appType: AppTypeEnum;
}
