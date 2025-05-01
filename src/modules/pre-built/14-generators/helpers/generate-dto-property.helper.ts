import { pascalCase, snakeCase } from "change-case";
import * as pluralize from "pluralize";
import { SchemaFieldDto } from "~modules/pre-built/14-generators/dto/schema-field.dto";
import {
  dataTypesMap,
  preBuiltMap,
  validatorMap,
} from "~modules/pre-built/14-generators/types/data-map.type";

export const singularSnakeCase = (name: string) => pluralize.singular(snakeCase(name));
export const getModuleImportPath = (name: string) => `~modules/${pluralize(snakeCase(name))}`;
export const getDtoPath = (name: string, fieldName: string) =>
  `${getModuleImportPath(name)}/dto/${singularSnakeCase(fieldName)}.dto`;
export const getDtoName = (name: string) => `${pascalCase(name)}Dto`;
export const getModulePath = (name: string) =>
  preBuiltMap[name]?.module || `${getModuleImportPath(name)}/${singularSnakeCase(name)}.module`;
export const getModuleName = (name: string) => `${pascalCase(name)}Module`;

export const getSchemaPath = (name: string) =>
  preBuiltMap[name]?.schema ||
  `${getModuleImportPath(name)}/schemas/${singularSnakeCase(name)}.schema`;
export const getSchemaName = (name: string) => `${pascalCase(name)}Schema`;
export const getModelName = (name: string) => `${pascalCase(name)}`;

const getFieldValueType = ({ fieldType, arrayType, fieldName }: SchemaFieldDto): string => {
  if (fieldType === "Object") return getDtoName(fieldName);

  if (fieldType === "Array" && arrayType === "Object") return `Array<${getDtoName(fieldName)}>`;

  return fieldType === "Array" ? `Array<${dataTypesMap[arrayType]}>` : dataTypesMap[fieldType];
};

const generateValidationDecorators = (field: SchemaFieldDto): string[] => {
  const { fieldType, options = {}, fieldName, arrayType } = field;
  const decorators: string[] = [];

  decorators.push(options.required ? "@IsNotEmpty()" : "@IsOptional()");
  const decoratorMap = {
    Date: ["@Type(() => Date)", "@Transform(({ value }) => new Date(value))"],
    Object: [`@Type(() => ${getDtoName(fieldName)})`, `@ValidateNested()`],
    Array: [`@ValidateNested({ each: true })`, `@Type(() => ${getDtoName(fieldName)})`],
  };

  const validator = validatorMap[fieldType];

  switch (fieldType) {
    case "Date":
      decorators.push(validator);
      decorators.push(...decoratorMap.Date);
      break;

    case "Object":
      decorators.push(validator);
      decorators.push(...decoratorMap.Object);
      break;

    case "Array":
      if (arrayType === "Object") {
        decorators.push(...decoratorMap.Array);
        decorators.push(validator);
      } else if (arrayType === "Number") {
        decorators.push(`@IsNumber({}, { each: true })`);
      } else {
        decorators.push(validator);
      }
      break;

    default:
      decorators.push(validator);
      break;
  }

  if (options.min !== undefined) decorators.push(`@Min(${options.min})`);
  if (options.max !== undefined) decorators.push(`@Max(${options.max})`);
  if (options.minLength !== undefined) decorators.push(`@MinLength(${options.minLength})`);
  if (options.maxLength !== undefined) decorators.push(`@MaxLength(${options.maxLength})`);

  return decorators;
};

export const getDtoRequiredImports = (schemaName: string, fields: SchemaFieldDto[]) => {
  const validatorOptions = new Set<string>();
  const classTransformOptions = new Set<string>();
  const imports: string[] = [];

  const addValidator = (condition: boolean, validator: string) => {
    if (condition) validatorOptions.add(validator);
  };

  const addTransformer = (condition: boolean, transformer: string) => {
    if (condition) classTransformOptions.add(transformer);
  };

  // Handle ObjectId
  if (fields.some(f => f.fieldType === "ObjectId")) {
    imports.push(`import { ObjectId } from "mongodb";`);
    imports.push(`import { IsObjectId } from "~common/validators/objectId";`);
  }

  // Handle embedded object fields
  fields
    .filter(f => f.fieldType === "Object")
    .forEach(f => {
      const fromPath = getDtoPath(schemaName, f.fieldName);
      imports.push(`import { ${getDtoName(f.fieldName)} } from "${fromPath}";`);
    });

  // Handle array of object fields
  fields
    .filter(f => f.fieldType === "Array" && f.arrayType === "Object")
    .forEach(f => {
      const fromPath = getDtoPath(schemaName, f.fieldName);
      imports.push(`import { ${getDtoName(f.fieldName)} } from "${fromPath}";`);
    });

  // Add class-validator decorators
  addValidator(
    fields.some(f => f.fieldType === "Number"),
    "IsNumber",
  );
  addValidator(
    fields.some(f => f.fieldType === "String"),
    "IsString",
  );
  addValidator(
    fields.some(f => f.fieldType === "Boolean"),
    "IsBoolean",
  );
  addValidator(
    fields.some(f => f.fieldType === "Date"),
    "IsDate",
  );
  addValidator(
    fields.some(f => f.fieldType === "Array"),
    "IsArray",
  );
  addValidator(
    fields.some(f => f.fieldType === "Object"),
    "IsObject",
  );
  addValidator(
    fields.some(f => f.fieldType === "Array" || f.arrayType === "Object"),
    "ValidateNested",
  );
  addValidator(
    fields.some(f => f.options?.min !== undefined),
    "Min",
  );
  addValidator(
    fields.some(f => f.options?.max !== undefined),
    "Max",
  );
  addValidator(
    fields.some(f => f.options?.minLength !== undefined),
    "MinLength",
  );
  addValidator(
    fields.some(f => f.options?.maxLength !== undefined),
    "MaxLength",
  );

  addValidator(
    fields.some(f => f.options?.required),
    "IsNotEmpty",
  );
  addValidator(true, "IsOptional"); // Default to optional unless explicitly required

  // Add class-transformer decorators
  addTransformer(
    fields.some(f => f.fieldType === "Date"),
    "Transform",
  );
  addTransformer(
    fields.some(f => f.fieldType === "Date" || f.fieldType === "Object"),
    "Type",
  );

  // Prepend decorator imports
  if (validatorOptions.size) {
    imports.unshift(
      `import { ${[...validatorOptions].sort().join(", ")} } from "class-validator";`,
    );
  }

  if (classTransformOptions.size) {
    imports.unshift(
      `import { ${[...classTransformOptions].sort().join(", ")} } from "class-transformer";`,
    );
  }

  return imports.join("\n");
};

export const generateDtoProperty = (field: SchemaFieldDto): string => {
  const { fieldName, options = {} } = field;
  const valueType = getFieldValueType(field);
  const decorators = generateValidationDecorators(field);

  if (options.enum) {
    const enumName = `${fieldName}Enum`;
    decorators.push(`@IsEnum(${enumName})`);
    return `
export enum ${enumName} {
${options.enum.map(val => `  ${val} = "${val}",`).join("\n")}
}
${decorators.join("\n")}
${fieldName}${options.required ? "" : "?"}: ${valueType};`;
  }

  return `${decorators.join("\n")}\n${fieldName}${options.required ? "" : "?"}: ${valueType};`;
};
