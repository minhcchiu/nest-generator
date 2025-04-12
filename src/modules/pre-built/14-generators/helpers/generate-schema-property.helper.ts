import { pascalCase, snakeCase } from "change-case";
import * as pluralize from "pluralize";
import { SchemaFieldDto } from "~modules/pre-built/14-generators/dto/schema-field.dto";
import {
  dataTypesMap,
  preBuiltMap,
  validatorMap,
} from "~modules/pre-built/14-generators/types/data-map.type";

export const getReferencesImports = (fields: SchemaFieldDto[]) => {
  const refNames = fields.filter(f => f.options?.ref).map(f => f.options?.ref);
  const importFolder = (refName: string) => `~modules/${pluralize(snakeCase(refName))}`;

  const refNameImports = refNames
    .map(refName => {
      const fromPath =
        preBuiltMap[refName]?.schema ||
        `${importFolder(refName)}/schemas/${snakeCase(refName)}.schema`;

      return `import { ${refName} } from "${fromPath}";`;
    })
    .join("\n");

  const refModuleImports = refNames
    .map(refName => {
      const fromPath =
        preBuiltMap[refName]?.module || `${importFolder(refName)}/${snakeCase(refName)}.module`;

      return `import { ${refName}Module } from "${fromPath}";`;
    })
    .join("\n");

  const modulesImports = refNames
    .map(refName => {
      return `${pascalCase(refName)}Module`;
    })
    .join(", ");

  return {
    refNameImports,
    refModuleImports,
    modulesImports,
  };
};

export const getRequiredImports = (fields: SchemaFieldDto[]) => {
  const imports = [
    `import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";`,
    `import { Document } from "mongoose";`,
  ];

  if (fields.some(f => f.fieldType === "ObjectId")) {
    imports[1] = `import { ObjectId } from "mongodb";`;
    imports.push(`import { Document, SchemaTypes } from "mongoose";`);
  }

  imports.push(getReferencesImports(fields).refNameImports);

  return imports.join("\n");
};

export const generateDtoProperty = (field: SchemaFieldDto): string => {
  const { fieldName, fieldType, options = {} } = field;
  const decorators: string[] = [];

  // Validation decorators
  if (options.required) decorators.push("@IsNotEmpty()");
  else decorators.push("@IsOptional()");

  if (fieldType === "Date")
    decorators.push(`@Type(() => Date)`, `@Transform(({ value }) => new Date(value))`);

  const validator = validatorMap[fieldType] || "IsString";

  decorators.push(`@${validator}()`);

  if (options.min !== undefined) decorators.push(`@Min(${options.min})`);
  if (options.max !== undefined) decorators.push(`@Max(${options.max})`);
  if (options.minLength !== undefined) decorators.push(`@MinLength(${options.minLength})`);
  if (options.maxLength !== undefined) decorators.push(`@MaxLength(${options.maxLength})`);

  if (options.enum) {
    const enumName = `${fieldName}Enum`;
    decorators.push(`@IsEnum(${enumName})`);

    return `
export enum ${enumName} {
${options.enum.map(val => `${val} = "${val}",`).join("\n")}
}
${decorators.join("\n")}
${fieldName}${options.required ? "" : "?"}: ${dataTypesMap[fieldType]};`;
  }

  return `${decorators.join("\n")}\n${fieldName}${options.required ? "" : "?"}: ${dataTypesMap[fieldType]};`;
};
