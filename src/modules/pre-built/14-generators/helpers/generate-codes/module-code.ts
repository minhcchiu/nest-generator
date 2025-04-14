import { pascalCase, snakeCase } from "change-case";
import * as pluralize from "pluralize";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import { getReferencesImports } from "~modules/pre-built/14-generators/helpers/generate-schema-property.helper";

export const generateModuleCode = ({ schemaName, schemaFields }: CreateGeneratorDto) => {
  const nameSnakeCase = snakeCase(schemaName);
  const namePascalCase = pascalCase(schemaName);

  const moduleCode = `import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ${namePascalCase}, ${namePascalCase}Schema } from "~modules/${pluralize(nameSnakeCase)}/schemas/${nameSnakeCase}.schema";
import { ${namePascalCase}Controller } from "~modules/${pluralize(nameSnakeCase)}/${nameSnakeCase}.controller";
import { ${namePascalCase}Service } from "~modules/${pluralize(nameSnakeCase)}/${nameSnakeCase}.service";
${getReferencesImports(schemaFields).refModuleImports}

@Module({
  imports: [MongooseModule.forFeature([{ name: ${namePascalCase}.name, schema: ${namePascalCase}Schema }]), ${getReferencesImports(schemaFields).modulesImports}],
  controllers: [${namePascalCase}Controller],
  providers: [${namePascalCase}Service],
  exports: [${namePascalCase}Service],
})
export class ${namePascalCase}Module {}
`;

  return {
    moduleCode,
  };
};
