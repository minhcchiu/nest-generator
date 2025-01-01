import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  plainId?: string;

  @IsOptional()
  @IsObjectId()
  userId: ObjectId;
}
