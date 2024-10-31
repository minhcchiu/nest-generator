import { Transform } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class SummaryDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  from?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  to?: Date;

  @IsOptional()
  @IsObjectId()
  accountId?: ObjectId;
}
