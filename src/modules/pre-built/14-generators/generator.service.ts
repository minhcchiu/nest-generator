import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { snakeCase } from "change-case";
import { mkdirSync, writeFileSync } from "fs";
import { Model } from "mongoose";
import { join } from "path";
import * as pluralize from "pluralize";
import { BaseService } from "~base-inherit/base.service";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import { generateControllerCode } from "~modules/pre-built/14-generators/helpers/generate-codes/controller-code";
import {
  generateCreateDtoCode,
  generateObjectDtoCode,
  generateUpdateDtoCode,
} from "~modules/pre-built/14-generators/helpers/generate-codes/dto-code";
import { generateModuleCode } from "~modules/pre-built/14-generators/helpers/generate-codes/module-code";
import { generateSchemaCode } from "~modules/pre-built/14-generators/helpers/generate-codes/schema-code";
import { generateServiceCode } from "~modules/pre-built/14-generators/helpers/generate-codes/service-code";
import { singularSnakeCase } from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";
import { generateImportToModule } from "~modules/pre-built/14-generators/helpers/generate-import-to-module";
import {
  Generator,
  GeneratorDocument,
} from "~modules/pre-built/14-generators/schemas/generator.schema";

@Injectable()
export class GeneratorService extends BaseService<GeneratorDocument> {
  constructor(@InjectModel(Generator.name) model: Model<GeneratorDocument>) {
    super(model);
  }

  async generateSchema({ schemaName, schemaFields }: CreateGeneratorDto) {
    const nameSnakeCase = snakeCase(schemaName);
    const resourceDir = join(process.cwd(), "src", "modules", pluralize(nameSnakeCase));

    mkdirSync(resourceDir, { recursive: true });

    this.generateDtoFile(resourceDir, { schemaName, schemaFields });
    this.generateSchemaFile(resourceDir, { schemaName, schemaFields });
    this.generateServiceFile(resourceDir, { schemaName, schemaFields });
    this.generateControllerFile(resourceDir, { schemaName, schemaFields });
    this.generateModuleFile(resourceDir, { schemaName, schemaFields });
    generateImportToModule(schemaName);
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

    const createDtoCode = generateCreateDtoCode({ schemaName, schemaFields });
    const updateDtoCode = generateUpdateDtoCode({ schemaName, schemaFields });

    const objectFields = schemaFields.filter(
      f => f.fieldType === "Object" || (f.fieldType === "Array" && f.arrayType === "Object"),
    );
    if (objectFields.length) {
      objectFields.forEach(field => {
        const filePath = join(resourceDir, "dto", `${singularSnakeCase(field.fieldName)}.dto.ts`);

        writeFileSync(filePath, generateObjectDtoCode(schemaName, field));
      });
    }

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
