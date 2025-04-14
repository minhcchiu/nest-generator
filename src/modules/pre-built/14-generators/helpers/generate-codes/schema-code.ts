import { pascalCase, snakeCase } from "change-case";
import * as pluralize from "pluralize";
import { CreateGeneratorDto } from "~modules/pre-built/14-generators/dto/create-generator.dto";
import { generateSchemaProperty } from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";
import { getRequiredImports } from "~modules/pre-built/14-generators/helpers/generate-schema-property.helper";

export const generateSchemaCode = ({ schemaName, schemaFields }: CreateGeneratorDto) => {
  const nameSnakeCase = snakeCase(schemaName);
  const namePascalCase = pascalCase(schemaName);

  const properties = schemaFields.map(field => generateSchemaProperty(field)).join("\n\n");

  const schemaCode = `${getRequiredImports(schemaFields)}
@Schema({ timestamps: true, versionKey: false, collection: "${pluralize(nameSnakeCase)}" })
export class ${namePascalCase} {
  ${properties}
}
  
export type ${namePascalCase}Document = ${namePascalCase} & Document;
export const ${namePascalCase}Schema = SchemaFactory.createForClass(${namePascalCase});
`;

  return {
    schemaCode,
  };
};
