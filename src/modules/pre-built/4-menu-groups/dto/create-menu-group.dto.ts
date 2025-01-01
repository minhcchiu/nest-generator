import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateMenuGroupDto {
  createdBy: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
