import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
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
  userId: Types.ObjectId;
}
