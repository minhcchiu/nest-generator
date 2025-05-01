import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import {
  getModelName,
  getSchemaPath,
} from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";

export const generateServiceCode = ({ schemaName }: CreateGeneratorDto) => {
  const namePascalCase = getModelName(schemaName);

  // Generate create dto
  const serviceCode = `import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { ${namePascalCase}, ${namePascalCase}Document } from "${getSchemaPath(schemaName)}";

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
