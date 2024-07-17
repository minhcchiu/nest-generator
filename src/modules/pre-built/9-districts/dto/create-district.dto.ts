import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateDistrictDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly provinceId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
