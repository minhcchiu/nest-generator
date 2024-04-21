import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
} from "class-validator";
import { AppTypeEnum } from "../enums/app-type.enum";

export class CreateBannerDto {
	@IsNotEmpty()
	@IsString()
	imageUrl: string;

	@IsNotEmpty()
	@IsString()
	title: string;

	@IsString()
	link: string;

	@IsNumber()
	startAt: number;

	@IsNumber()
	endAt: number;

	@IsNotEmpty()
	@IsNumber()
	position: number;

	@IsBoolean()
	isActive: boolean;

	@IsNotEmpty()
	@IsEnum(AppTypeEnum)
	appType: AppTypeEnum;
}
