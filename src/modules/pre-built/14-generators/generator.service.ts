import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { snakeCase } from "change-case";
import { mkdirSync, writeFileSync } from "fs";
import { Model } from "mongoose";
import { join } from "path";
import * as pluralize from "pluralize";
import { BaseService } from "~base-inherit/base.service";
import { generateControllerCode } from "~modules/pre-built/14-generators/helpers/generate-controller-code.helper";
import { generateDtoCode } from "~modules/pre-built/14-generators/helpers/generate-dto-code.heloper";
import { getDtoRequiredImports } from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";
import { generateModuleCode } from "~modules/pre-built/14-generators/helpers/generate-module-code.helper";
import { generateSchemaCode } from "~modules/pre-built/14-generators/helpers/generate-schema-code.heloper";
import { generateDtoProperty } from "~modules/pre-built/14-generators/helpers/generate-schema-property.helper";
import { generateServiceCode } from "~modules/pre-built/14-generators/helpers/generate-service-code.helper";
import { CreateGeneratorDto } from "./dto/create-generator.dto";
import { Generator, GeneratorDocument } from "./schemas/generator.schema";

@Injectable()
export class GeneratorService extends BaseService<GeneratorDocument> {
  constructor(@InjectModel(Generator.name) model: Model<GeneratorDocument>) {
    super(model);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async generateDto({ schemaName, schemaFields }: CreateGeneratorDto) {
    const properties = schemaFields.map(field => generateDtoProperty(field)).join("\n\n");

    const createDtoCode = `
${getDtoRequiredImports(schemaFields)}

export class ${schemaName}Dto {
${properties}
}
`;

    return createDtoCode.trim();
  }

  async generateSchema({ schemaName, schemaFields }: CreateGeneratorDto) {
    const nameSnakeCase = snakeCase(schemaName);
    const resourceDir = join(process.cwd(), "src", "modules", pluralize(nameSnakeCase));

    mkdirSync(resourceDir, { recursive: true });

    this.generateSchemaFile(resourceDir, { schemaName, schemaFields });
    this.generateDtoFile(resourceDir, { schemaName, schemaFields });
    this.generateServiceFile(resourceDir, { schemaName, schemaFields });
    this.generateControllerFile(resourceDir, { schemaName, schemaFields });
    this.generateModuleFile(resourceDir, { schemaName, schemaFields });
  }

  generateModuleFile(resourceDir: string, { schemaName, schemaFields }: CreateGeneratorDto) {
    const moduleFilePath = join(resourceDir, `${snakeCase(schemaName)}.module.ts`);

    const { moduleCode } = generateModuleCode({ schemaName, schemaFields });

    writeFileSync(moduleFilePath, moduleCode);
  }

  generateControllerFile(resourceDir: string, { schemaName, schemaFields }: CreateGeneratorDto) {
    const controllerFilePath = join(resourceDir, `${snakeCase(schemaName)}.controller.ts`);

    const { controllerCode } = generateControllerCode({ schemaName, schemaFields });

    writeFileSync(controllerFilePath, controllerCode);
  }

  generateServiceFile(resourceDir: string, { schemaName, schemaFields }: CreateGeneratorDto) {
    const serviceFilePath = join(resourceDir, `${snakeCase(schemaName)}.service.ts`);

    const { serviceCode } = generateServiceCode({ schemaName, schemaFields });

    writeFileSync(serviceFilePath, serviceCode);
  }

  generateDtoFile(resourceDir: string, { schemaName, schemaFields }: CreateGeneratorDto) {
    mkdirSync(join(resourceDir, "dto"), { recursive: true });

    const { createDtoCode, updateDtoCode } = generateDtoCode({ schemaName, schemaFields });

    const filePathCreateDto = join(resourceDir, "dto", `create-${snakeCase(schemaName)}.dto.ts`);
    const filePathUpdateDto = join(resourceDir, "dto", `update-${snakeCase(schemaName)}.dto.ts`);

    writeFileSync(filePathCreateDto, createDtoCode);
    writeFileSync(filePathUpdateDto, updateDtoCode);
  }

  generateSchemaFile(resourceDir: string, { schemaName, schemaFields }: CreateGeneratorDto) {
    mkdirSync(join(resourceDir, "schemas"), { recursive: true });

    const filePath = join(resourceDir, "schemas", `${snakeCase(schemaName)}.schema.ts`);

    const { schemaCode } = generateSchemaCode({ schemaName, schemaFields });

    writeFileSync(filePath, schemaCode);
  }
}
