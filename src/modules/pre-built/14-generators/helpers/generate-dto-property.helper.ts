import { pascalCase } from "change-case";
import { SchemaFieldDto } from "~modules/pre-built/14-generators/dto/schema-field.dto";
import { dataTypesMap } from "~modules/pre-built/14-generators/types/data-map.type";

export const schemaTypesMap = {
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
  Date: "Date",
  ObjectId: "SchemaTypes.ObjectId",
  Mixed: "SchemaTypes.Mixed",
};

export const getDtoRequiredImports = (fields: SchemaFieldDto[]) => {
  const validatorOptions: Set<string> = new Set();
  const ClassTransformOptions: Set<string> = new Set();
  const imports: string[] = [];

  if (fields.some(f => f.fieldType === "ObjectId")) {
    imports.push(`import { ObjectId } from "mongodb";`);
    imports.push(`import { IsObjectId } from "~common/validators/objectId";`);
  }

  if (fields.some(f => f.fieldType === "Number")) validatorOptions.add(`IsNumber`);
  if (fields.some(f => f.fieldType === "Date")) {
    validatorOptions.add(`IsDate`);
    ClassTransformOptions.add(`Transform`);
    ClassTransformOptions.add(`Type`);
  }
  if (fields.some(f => f.fieldType === "String")) validatorOptions.add(`IsString`);
  if (fields.some(f => f.fieldType === "Boolean")) validatorOptions.add(`IsBoolean`);
  if (fields.some(f => f.fieldType === "Array")) validatorOptions.add(`IsArray`);
  if (fields.some(f => f.options?.min !== undefined)) validatorOptions.add(`Min`);
  if (fields.some(f => f.options?.max)) validatorOptions.add(`Max`);
  if (fields.some(f => f.options?.minLength)) validatorOptions.add(`MinLength`);
  if (fields.some(f => f.options?.maxLength)) validatorOptions.add(`MaxLength`);
  if (fields.some(f => f.options?.default)) validatorOptions.add(`IsOptional`);
  if (fields.some(f => f.options.required)) validatorOptions.add(`IsNotEmpty`);

  if (validatorOptions.size) {
    imports.unshift(
      `import { ${[...validatorOptions].sort().join(", ")} } from "class-validator";`,
    );
  }

  if (ClassTransformOptions.size) {
    imports.unshift(
      `import { ${[...ClassTransformOptions].sort().join(", ")} } from "class-transformer";`,
    );
  }

  return imports.join("\n");
};

export const generateSchemaProperty = (field: SchemaFieldDto): string => {
  const { fieldName, fieldType, options = {}, arrayType, arrayValues } = field;
  const propOptions: string[] = [];

  switch (fieldType) {
    case "Array": {
      if (arrayType === "Object") {
        const propValues: Record<string, object> = {};
        for (const arrayValue of arrayValues) {
          propValues[arrayValue.fieldName] = {
            type: schemaTypesMap[arrayValue.fieldType] || "SchemaTypes.Mixed",
          };

          if (arrayValue.options.ref) {
            Object.assign(propValues[arrayValue.fieldName], {
              ref: `${pascalCase(arrayValue.options.ref)}.name`,
            });
          }
          if (arrayValue.options.min !== undefined)
            Object.assign(propValues[arrayValue.fieldName], {
              min: arrayValue.options.min,
            });
          if (arrayValue.options.max !== undefined)
            Object.assign(propValues[arrayValue.fieldName], {
              max: arrayValue.options.max,
            });
          if (arrayValue.options.default !== undefined)
            Object.assign(propValues[arrayValue.fieldName], {
              default: arrayValue.options.default,
            });
        }

        propOptions.push(
          `type: [{ ${Object.keys(propValues)
            .map(
              key =>
                ` ${key}: { ${Object.keys(propValues[key])
                  .map(propKey => ` ${propKey}: ${propValues[key][propKey]}`)
                  .join(", ")} }`,
            )
            .join(", ")} }]`,
        );

        let defaultValues: any[] = [];
        if (options.default !== undefined && Array.isArray(options.default)) {
          defaultValues = options.default.map((item: Record<string, any>) => {
            return Object.keys(item)
              .map(key => {
                return `${key}: ${typeof item[key] === "string" ? `"${item[key]}"` : item[key]}`;
              })
              .join(", ");
          });
        }

        propOptions.push(`default: [{${defaultValues.join(", ")}}]`);

        const propDecorator = `@Prop({ ${propOptions.join(", ")} })`;
        return `  ${propDecorator}\n  ${fieldName}: Array<any> = [{${defaultValues.join(", ")}}];`;
      } else {
        const propValues: Record<string, any> = {
          type: schemaTypesMap[arrayType] || "SchemaTypes.Mixed",
        };
        if (options.ref) propValues.ref = `${pascalCase(options.ref)}.name`;
        if (options.min !== undefined) propValues.min = options.min;
        if (options.max !== undefined) propValues.max = options.max;

        propOptions.push(
          `type: [{ ${Object.keys(propValues)
            .map(key => ` ${key}: ${propValues[key]}`)
            .join(", ")} }]`,
        );

        let defaultValues: any[] = [];
        if (options.default !== undefined && Array.isArray(options.default)) {
          defaultValues = options.default.map(item => {
            return typeof item === "string" ? `"${item}"` : item;
          });
        }
        propOptions.push(`default: [${defaultValues.join(", ")}]`);

        const propDecorator = `@Prop({ ${propOptions.join(", ")} })`;
        return `  ${propDecorator}\n  ${fieldName}: Array<${dataTypesMap[arrayType]}> = [${defaultValues.join(", ")}];`;
      }
    }

    default: {
      const propType = schemaTypesMap[fieldType] || "SchemaTypes.Mixed";
      // Handle type
      propOptions.push(`type: ${propType}`);
      // Handle other options
      if (options.ref) propOptions.push(`ref: ${pascalCase(options.ref)}.name`);
      if (options.required) propOptions.push("required: true");
      if (options.unique) propOptions.push("unique: true");
      if (options.index) propOptions.push("index: true");
      if (options.min !== undefined) propOptions.push(`min: ${options.min}`);
      if (options.max !== undefined) propOptions.push(`max: ${options.max}`);
      if (options.default !== undefined) {
        const defaultValue =
          typeof options.default === "string" ? `"${options.default}"` : options.default;
        propOptions.push(`default: ${defaultValue}`);
      }

      const propDecorator = `@Prop({ ${propOptions.join(", ")} })`;

      return `  ${propDecorator}\n  ${fieldName}${options.required ? "" : "?"}: ${dataTypesMap[fieldType]};`;
    }
  }
};
