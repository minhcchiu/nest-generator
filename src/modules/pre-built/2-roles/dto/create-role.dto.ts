import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  readonly key: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
