import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateMenuDto {
  @IsOptional()
  @IsArray()
  @IsObjectId({ each: true })
  readonly menuGroupIds: ObjectId[];

  @IsOptional()
  @IsObjectId()
  readonly parentId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  readonly systemMenuId?: ObjectId;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  readonly sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  readonly isHorizontal?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isShow?: boolean;
}
