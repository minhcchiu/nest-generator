import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class ProjectDto {
  @IsNotEmpty()
  @IsObjectId()
  userId: ObjectId;

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
