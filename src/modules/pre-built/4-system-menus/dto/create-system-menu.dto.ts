import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateSystemMenuDto {
  @IsOptional()
  @IsObjectId()
  @ToObjectId()
  readonly parentId?: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  readonly isGroup: boolean;

  @IsOptional()
  @IsString()
  readonly icon?: string;

  @IsOptional()
  @IsString()
  readonly href?: string;

  @IsOptional()
  @IsNumber()
  readonly position?: number;

  @IsOptional()
  @IsBoolean()
  readonly isHorizontal?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isShow?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isSystem?: boolean;
}
