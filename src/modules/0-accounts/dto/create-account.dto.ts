import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  plainId?: string;

  @IsOptional()
  @IsObjectId()
  @ToObjectId()
  userId: ObjectId;
}
