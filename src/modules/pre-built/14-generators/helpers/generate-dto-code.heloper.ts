import { pascalCase, snakeCase } from "change-case";
import * as pluralize from "pluralize";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import { getDtoRequiredImports } from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";
import { generateDtoProperty } from "~modules/pre-built/14-generators/helpers/generate-schema-property.helper";

export const generateDtoCode = ({ schemaName, schemaFields }: CreateGeneratorDto) => {
  const nameSnakeCase = snakeCase(schemaName);
  const namePascalCase = pascalCase(schemaName);

  // Generate create dto
  const properties = schemaFields.map(field => generateDtoProperty(field)).join("\n\n");
  const createDtoCode = `${getDtoRequiredImports(schemaFields)}

export class Create${namePascalCase}Dto {
${properties}
}
`;

  // Generate update dto
  const updateDtoCode = `import { PartialType } from "@nestjs/mapped-types";
import { Create${namePascalCase}Dto } from "~modules/${pluralize(nameSnakeCase)}/dto/create-${nameSnakeCase}.dto";

export class Update${namePascalCase}Dto extends PartialType(Create${namePascalCase}Dto) {}
`;

  return {
    createDtoCode,
    updateDtoCode,
  };
};
