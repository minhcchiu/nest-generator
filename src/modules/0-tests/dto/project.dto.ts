import { Type } from "class-transformer";
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class ProjectDto {
	@IsNotEmpty()
	@IsObjectId()
	@ToObjectId()
	userId: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	desc?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];

	@IsOptional()
	@ValidateNested({ message: "project must be an object" })
	@Type(() => ProjectDto)
	project?: ProjectDto;
}
