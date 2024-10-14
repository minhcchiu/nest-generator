import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreatePolicyGroupDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  createdBy: ObjectId;
}
