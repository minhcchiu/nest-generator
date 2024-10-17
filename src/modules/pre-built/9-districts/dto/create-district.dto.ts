import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateDistrictDto {
  @IsNotEmpty()
  @IsObjectId()
  readonly provinceId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
