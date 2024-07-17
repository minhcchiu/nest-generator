import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { HttpMethod } from "../enum/http-method";

export class CreatePolicyDto {
  policyKey: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly collectionName: string;

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
