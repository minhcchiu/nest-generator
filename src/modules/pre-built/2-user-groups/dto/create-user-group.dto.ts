import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserGroupDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  readonly position?: number;
}
