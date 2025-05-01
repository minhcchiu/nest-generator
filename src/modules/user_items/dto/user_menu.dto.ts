import { IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class UserMenuDto {
  @IsOptional()
  @IsObjectId()
  userId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  menuId?: ObjectId;
}
