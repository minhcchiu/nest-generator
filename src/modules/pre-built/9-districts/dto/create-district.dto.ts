import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateDistrictDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly provinceId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
