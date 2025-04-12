import { pascalCase, snakeCase } from "change-case";
import * as pluralize from "pluralize";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";

export const generateServiceCode = ({ schemaName }: CreateGeneratorDto) => {
  const nameSnakeCase = snakeCase(schemaName);
  const namePascalCase = pascalCase(schemaName);

  // Generate create dto
  const serviceCode = `import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { ${namePascalCase}, ${namePascalCase}Document } from "~modules/${pluralize(nameSnakeCase)}/schemas/${snakeCase(schemaName)}.schema";

@Injectable()
export class ${namePascalCase}Service extends BaseService<${namePascalCase}Document> {
  constructor(@InjectModel(${namePascalCase}.name) model: Model<${namePascalCase}Document>) {
    super(model);
  }
}
`;

  return {
    serviceCode,
  };
};
