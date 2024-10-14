import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { AppTypeEnum } from "../enums/app-type.enum";
import { ProjectDto } from "./project.dto";

export class CreateTestDto {
  @IsObjectId()
  @ToObjectId()
  userId: ObjectId;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsArray()
  @IsDateString({}, { each: true })
  dates: Date[];

  @IsOptional()
  @ValidateNested({ each: true, message: "projects is not valid" })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectDto)
  project?: ProjectDto;

  @IsNotEmpty()
  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsEnum(AppTypeEnum)
  appType: AppTypeEnum;
}
