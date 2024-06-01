import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { CreateMenuDto } from "~modules/pre-built/4-menus/dto/create-menu.dto";

export class MenuCustomerDto {
	@IsNotEmpty()
	@IsMongoId()
	menuId: Types.ObjectId;

	@IsNotEmpty()
	@Type(() => CreateMenuDto)
	custom: CreateMenuDto;
}
