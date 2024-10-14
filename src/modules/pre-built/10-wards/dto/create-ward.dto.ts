import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateWardDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly provinceId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly districtId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
