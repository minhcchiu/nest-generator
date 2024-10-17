import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  payee: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsISO8601()
  date: Date;

  @IsNotEmpty()
  @IsObjectId({ each: true })
  accountId: ObjectId[];

  @IsNotEmpty()
  @IsObjectId()
  categoryId: ObjectId;
}
