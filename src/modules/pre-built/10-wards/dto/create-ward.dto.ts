import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateWardDto {
  @IsNotEmpty()
  @IsObjectId()
  readonly provinceId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  readonly districtId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
