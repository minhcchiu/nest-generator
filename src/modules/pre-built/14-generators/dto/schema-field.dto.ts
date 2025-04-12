import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { FieldOptionDto } from "~modules/pre-built/14-generators/dto/field-option.dto";

export class SchemaFieldDto {
  @IsNotEmpty()
  @IsString()
  fieldName: string;

  @IsNotEmpty()
  @IsString()
  fieldType: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldOptionDto)
  options?: FieldOptionDto;
}
