import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { HttpMethod } from "../enum/http-method";

export class CreatePolicyDto {
  policyKey: string;
  collectionName?: string;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly policyGroupId?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly endpoint: string;

  @IsEnum(HttpMethod)
  readonly method: HttpMethod;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsBoolean()
  readonly isPublic?: boolean;
}
