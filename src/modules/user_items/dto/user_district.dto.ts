import { IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class UserDistrictDto {
  @IsOptional()
  @IsObjectId()
  userId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  wardId?: ObjectId;
}
