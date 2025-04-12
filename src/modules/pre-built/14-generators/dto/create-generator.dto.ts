import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { SchemaFieldDto } from "~modules/pre-built/14-generators/dto/schema-field.dto";

export class CreateGeneratorDto {
  @IsNotEmpty()
  @IsString()
  schemaName: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SchemaFieldDto)
  schemaFields: Array<SchemaFieldDto>;
}
