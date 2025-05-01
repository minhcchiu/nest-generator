import { snakeCase } from "change-case";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import { SchemaFieldDto } from "~modules/pre-built/14-generators/dto/schema-field.dto";
import {
  generateDtoProperty,
  getDtoName,
  getDtoRequiredImports,
  getModuleImportPath,
} from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";

export const generateCreateDtoCode = ({ schemaName, schemaFields }: CreateGeneratorDto) => {
  // Generate create dto
  const properties = schemaFields.map(field => generateDtoProperty(field)).join("\n\n");
  const createDtoCode = `${getDtoRequiredImports(schemaName, schemaFields)}

export class Create${getDtoName(schemaName)} {
${properties}
}
`;

  return createDtoCode;
};

export const generateUpdateDtoCode = ({ schemaName }: CreateGeneratorDto) => {
  const nameSnakeCase = snakeCase(schemaName);

  // Generate update dto
  const updateDtoCode = `import { PartialType } from "@nestjs/mapped-types";
import { Create${getDtoName(schemaName)} } from "${getModuleImportPath(schemaName)}/dto/create-${nameSnakeCase}.dto";

export class Update${getDtoName(schemaName)} extends PartialType(Create${getDtoName(schemaName)}) {}
`;

  return updateDtoCode;
};

export const generateObjectDtoCode = (
  schemaName: string,
  { arrayValues, fieldName }: SchemaFieldDto,
) => {
  const properties = arrayValues.map(field => generateDtoProperty(field)).join("\n\n");

  const objectDtoCode = `${getDtoRequiredImports(schemaName, arrayValues)}

export class ${getDtoName(fieldName)} {
  ${properties}
}
`;

  return objectDtoCode;
};
