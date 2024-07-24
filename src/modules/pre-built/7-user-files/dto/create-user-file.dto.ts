import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~pre-built/7-uploads/enum/store-location.enum";

export class CreateUserFileDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString({ each: true })
  resourceKeys: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsEnum(ResourceTypeEnum)
  resourceType: ResourceTypeEnum;

  @IsOptional()
  @IsString()
  urlXSmall?: string;

  @IsOptional()
  @IsString()
  urlSmall?: string;

  @IsOptional()
  @IsString()
  urlMedium?: string;

  @IsOptional()
  @IsString()
  urlLarge?: string;

  @IsOptional()
  @IsString()
  urlXLarge?: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsEnum(StorageLocationEnum)
  storageLocation: StorageLocationEnum;
}
