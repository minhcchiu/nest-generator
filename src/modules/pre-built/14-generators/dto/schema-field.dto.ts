import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { FieldOptionDto } from "~modules/pre-built/14-generators/dto/field-option.dto";

export class SchemaFieldDto {
  @IsNotEmpty()
  @IsString()
  fieldName: string;

  @IsNotEmpty()
  @IsString()
  fieldType: string;

  @ValidateIf(o => o.fieldType === "Array")
  @IsString()
  arrayType?: string;

  @ValidateIf(o => o.fieldType === "Array")
  @ValidateNested({ each: true })
  @Type(() => SchemaFieldDto)
  arrayValues: SchemaFieldDto[] = [];

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldOptionDto)
  options?: FieldOptionDto;
}
