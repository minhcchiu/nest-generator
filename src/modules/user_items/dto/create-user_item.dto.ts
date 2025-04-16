import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateUserItemDto {
  @IsNotEmpty()
  @IsObjectId()
  userId: ObjectId;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountValue: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  @IsDate()
  expiresAt: Date;

  @IsOptional()
  @IsArray()
  strings?: Array<any>;

  @IsOptional()
  @IsArray()
  notifications?: Array<any>;

  @IsOptional()
  @IsString()
  object?: undefined;

  @IsOptional()
  @IsArray()
  @Min(0)
  @Max(100)
  numbers?: Array<any>;

  @IsOptional()
  @IsArray()
  orderItems?: Array<any>;
}
