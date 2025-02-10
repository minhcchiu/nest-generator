import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { ToObjectId } from "~common/validators/objectId";

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly resourceKey: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsArray()
  @ToObjectId({ each: true })
  readonly relationResourceIds: ObjectId[] = [];

  @IsNotEmpty()
  @ToObjectId()
  createdBy: ObjectId;
}
