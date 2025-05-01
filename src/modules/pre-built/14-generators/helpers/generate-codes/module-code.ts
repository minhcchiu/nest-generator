import { pascalCase, snakeCase } from "change-case";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import {
  getModuleImportPath,
  getSchemaPath,
} from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";
import { generateReferenceImports } from "~modules/pre-built/14-generators/helpers/generate-schema-property.helper";

export const generateModuleCode = ({ schemaName, schemaFields }: CreateGeneratorDto) => {
  const nameSnakeCase = snakeCase(schemaName);
  const namePascalCase = pascalCase(schemaName);

  const moduleCode = `import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ${namePascalCase}, ${namePascalCase}Schema } from "${getSchemaPath(schemaName)}";
import { ${namePascalCase}Controller } from "${getModuleImportPath(schemaName)}/${nameSnakeCase}.controller";
import { ${namePascalCase}Service } from "${getModuleImportPath(schemaName)}/${nameSnakeCase}.service";
${generateReferenceImports(schemaFields).refModuleImports}

@Module({
  imports: [MongooseModule.forFeature([{ name: ${namePascalCase}.name, schema: ${namePascalCase}Schema }]), ${generateReferenceImports(schemaFields).moduleNames}],
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
