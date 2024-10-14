import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateMenuDto {
  @IsOptional()
  @IsArray()
  @IsObjectId({ each: true })
  @ToObjectId({ each: true })
  readonly menuGroupIds: ObjectId[];

  @IsOptional()
  @IsObjectId()
  @ToObjectId()
  readonly parentId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  @ToObjectId()
  readonly systemMenuId?: ObjectId;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  readonly position?: number;

  @IsOptional()
  @IsBoolean()
  readonly isHorizontal?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isShow?: boolean;
}
