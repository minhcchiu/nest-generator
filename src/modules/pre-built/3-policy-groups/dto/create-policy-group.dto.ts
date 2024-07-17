import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreatePolicyGroupDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  createdBy: Types.ObjectId;
}
