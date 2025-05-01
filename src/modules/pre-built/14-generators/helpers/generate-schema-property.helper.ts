import { pascalCase } from "change-case";
import { SchemaFieldDto } from "~modules/pre-built/14-generators/dto/schema-field.dto";
import {
  getDtoName,
  getDtoPath,
  getModelName,
  getModuleName,
  getModulePath,
  getSchemaPath,
} from "~modules/pre-built/14-generators/helpers/generate-dto-property.helper";
import { dataTypesMap } from "~modules/pre-built/14-generators/types/data-map.type";
import { isObjectId } from "~utils/stringId_to_objectId";

export const schemaTypesMap = {
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
  Date: "Date",
  ObjectId: "SchemaTypes.ObjectId",
  Mixed: "SchemaTypes.Mixed",
};

interface ReferenceImports {
  refNameImports: string;
  refModuleImports: string;
  moduleNames: string;
}

const collectReferenceImports = (fields: SchemaFieldDto[]): ReferenceImports => {
  const refNames = fields.filter(f => f.options?.ref).map(f => f.options.ref);
  const arrayValueRefNames = fields
    .filter(f => f.arrayValues?.length)
    .flatMap(f => f.arrayValues.map(v => v.options?.ref).filter(Boolean));

  const allRefNames = [...new Set([...refNames, ...arrayValueRefNames])];

  const refNameImports = allRefNames.map(
    refName => `import { ${getModelName(refName)} } from "${getSchemaPath(refName)}";`,
  );

  const refModuleImports = allRefNames.map(
    refName => `import { ${getModuleName(refName)} } from "${getModulePath(refName)}";`,
  );

  const moduleNames = allRefNames.map(refName => getModuleName(refName));

  return {
    refNameImports: refNameImports.join("\n"),
    refModuleImports: refModuleImports.join("\n"),
    moduleNames: moduleNames.join(", "),
  };
};

export const generateReferenceImports = (fields: SchemaFieldDto[]): ReferenceImports =>
  collectReferenceImports(fields);

const collectBaseImports = (fields: SchemaFieldDto[]): string[] => {
  const imports = [
    `import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";`,
    `import { Document } from "mongoose";`,
  ];

  if (
    fields.some(
      f =>
        f.fieldType === "ObjectId" ||
        f.arrayType === "ObjectId" ||
        f.arrayValues?.some(a => a.fieldType === "ObjectId"),
    )
  ) {
    imports.push(`import { ObjectId } from "mongodb";`);
    imports[1] = `import { Document, SchemaTypes } from "mongoose";`;
  }

  return imports;
};

const addDtoImports = (schemaName: string, fields: SchemaFieldDto[], imports: string[]) => {
  const objectFields = fields.filter(f => f.fieldType === "Object");

  objectFields.forEach(f => {
    imports.push(
      `import { ${getDtoName(f.fieldName)} } from "${getDtoPath(schemaName, f.fieldName)}";`,
    );
  });

  const arrayObjectFields = fields.filter(f => f.fieldType === "Array" && f.arrayType === "Object");
  arrayObjectFields.forEach(f => {
    imports.push(
      `import { ${getDtoName(f.fieldName)} } from "${getDtoPath(schemaName, f.fieldName)}";`,
    );
  });
};

export const generateRequiredImports = (schemaName: string, fields: SchemaFieldDto[]): string => {
  const imports = collectBaseImports(fields);

  addDtoImports(schemaName, fields, imports);

  imports.push(generateReferenceImports(fields).refNameImports);

  return imports.join("\n");
};
export const generateSchemaProperty = (field: SchemaFieldDto): string => {
  const { fieldName, fieldType, options = {}, arrayType, arrayValues } = field;
  const propOptions: string[] = [];

  const formatDefaultValue = (value: any): string =>
    isObjectId(value)
      ? `new ObjectId("${value}")`
      : typeof value === "string"
        ? `"${value}"`
        : value;

  const buildSubFields = (values: SchemaFieldDto[]): Record<string, any> => {
    const result: Record<string, any> = {};
    for (const val of values) {
      result[val.fieldName] = {
        type: schemaTypesMap[val.fieldType] || "SchemaTypes.Mixed",
      };

      if (val.options?.ref) result[val.fieldName].ref = `${getModelName(val.options.ref)}.name`;
      if (val.options?.min !== undefined) result[val.fieldName].min = val.options.min;
      if (val.options?.max !== undefined) result[val.fieldName].max = val.options.max;
      if (val.options?.default !== undefined) result[val.fieldName].default = val.options.default;
    }
    return result;
  };

  const buildDefaultObject = (defaults: Record<string, any>): string[] =>
    Object.entries(defaults).map(([key, val]) => `${key}: ${formatDefaultValue(val)}`);

  const buildFieldDefinition = (
    typeString: string,
    valueType: string,
    defaults?: string[],
  ): string => {
    const propDecorator = `@Prop({ ${propOptions.join(", ")} })`;
    const defaultAssign = defaults?.length ? ` = { ${defaults.join(", ")} };` : ";";
    return `  ${propDecorator}\n  ${fieldName}: ${valueType}${defaultAssign}`;
  };

  const buildArrayDefinition = (
    typeString: string,
    valueType: string,
    defaults?: string[],
  ): string => {
    const propDecorator = `@Prop({ ${propOptions.join(", ")} })`;
    const defaultAssign = defaults?.length ? ` = [${defaults.join(", ")}];` : " = [];";
    return `  ${propDecorator}\n  ${fieldName}: Array<${valueType}>${defaultAssign}`;
  };

  switch (fieldType) {
    case "Object": {
      const propValues = buildSubFields(arrayValues);
      const fields = Object.entries(propValues)
        .map(
          ([key, config]) =>
            ` ${key}: { ${Object.entries(config)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")} }`,
        )
        .join(", ");

      propOptions.push(`type: {${fields}}`);

      let defaultValues: string[] = [];
      if (typeof options.default === "object" && !Array.isArray(options.default)) {
        defaultValues = buildDefaultObject(options.default);
      }

      if (defaultValues.length) {
        propOptions.push(`default: { ${defaultValues.join(", ")} }`);
      }

      return buildFieldDefinition("Object", getDtoName(fieldName), defaultValues);
    }

    case "Array": {
      if (arrayType === "Object") {
        const propValues = buildSubFields(arrayValues);
        const fields = Object.entries(propValues)
          .map(
            ([key, config]) =>
              ` ${key}: { ${Object.entries(config)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")} }`,
          )
          .join(", ");

        propOptions.push(`type: [{${fields}}]`);

        let defaultValues: string[] = [];
        if (Array.isArray(options.default)) {
          defaultValues = options.default.map((item: Record<string, any>) =>
            Object.entries(item)
              .map(([k, v]) => `${k}: ${formatDefaultValue(v)}`)
              .join(", "),
          );
        }

        if (defaultValues.length) {
          propOptions.push(`default: [{${defaultValues.join("}, {")}}]`);
        }

        return buildArrayDefinition(
          "Array<Object>",
          getDtoName(fieldName),
          defaultValues.map(val => `{${val}}`),
        );
      }

      const basicArrayType = schemaTypesMap[arrayType] || "SchemaTypes.Mixed";
      const propValues: Record<string, any> = { type: basicArrayType };

      if (options.ref) propValues.ref = `${pascalCase(options.ref)}.name`;
      if (options.min !== undefined) propValues.min = options.min;
      if (options.max !== undefined) propValues.max = options.max;

      propOptions.push(
        `type: [{ ${Object.entries(propValues)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")} }]`,
      );

      let defaultValues: string[] = [];
      if (Array.isArray(options.default)) {
        defaultValues = options.default.map(formatDefaultValue);
      }

      if (defaultValues.length) {
        propOptions.push(`default: [${defaultValues.join(", ")}]`);
      }

      return buildArrayDefinition("Array", dataTypesMap[arrayType], defaultValues);
    }

    default: {
      const propType = schemaTypesMap[fieldType] || "SchemaTypes.Mixed";
      propOptions.push(`type: ${propType}`);

      if (options.ref) propOptions.push(`ref: ${pascalCase(options.ref)}.name`);
      if (options.required) propOptions.push("required: true");
      if (options.unique) propOptions.push("unique: true");
      if (options.index) propOptions.push("index: true");
      if (options.min !== undefined) propOptions.push(`min: ${options.min}`);
      if (options.max !== undefined) propOptions.push(`max: ${options.max}`);
      if (options.default !== undefined)
        propOptions.push(`default: ${formatDefaultValue(options.default)}`);

      const propDecorator = `@Prop({ ${propOptions.join(", ")} })`;
      const optionalFlag = options.required ? "" : "?";
      return `  ${propDecorator}\n  ${fieldName}${optionalFlag}: ${dataTypesMap[fieldType]};`;
    }
  }
};
