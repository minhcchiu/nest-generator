import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateWardDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly provinceId: Types.ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly districtId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
