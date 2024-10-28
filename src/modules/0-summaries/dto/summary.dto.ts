import { Transform } from "class-transformer";
import { IsISO8601, IsOptional } from "class-validator";
import { parse } from "date-fns";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class SummaryDto {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => parse(value, "yyyy-MM-dd", new Date()))
  from?: Date;

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => parse(value, "yyyy-MM-dd", new Date()))
  to?: Date;

  @IsOptional()
  @IsObjectId()
  accountId?: ObjectId;
}
