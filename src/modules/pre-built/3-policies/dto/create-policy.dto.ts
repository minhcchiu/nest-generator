import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { HttpMethod } from "../enum/http-method";

export class CreatePolicyDto {
  resourceKey?: string;

  @IsNotEmpty()
  @IsString()
  policyKey: string;

  @IsNotEmpty()
  @IsObjectId()
  resourceId?: ObjectId;

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

  @IsOptional()
  @IsBoolean()
  readonly isAuthenticated?: boolean;
}
