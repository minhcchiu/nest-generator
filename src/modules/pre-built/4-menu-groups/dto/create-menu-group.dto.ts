import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateMenuGroupDto {
	createdBy: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsString()
	readonly description?: string;
}
