import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class ObjectDto {
  @IsNotEmpty()
  @IsObjectId()
  settingId: ObjectId;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountValue: number;
}
