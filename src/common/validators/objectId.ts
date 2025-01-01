import { Transform } from "class-transformer";
import { ObjectId } from "mongodb";

import { registerDecorator, ValidationOptions } from "class-validator";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { IsObjectIdConstraint } from "./constraint";

export function ToObjectId(options?: ValidationOptions) {
  return Transform(({ value }) => {
    if (typeof value === "string" && ObjectId.isValid(value)) return stringIdToObjectId(value);

    if (options?.each && Array.isArray(value) && value.every(val => ObjectId.isValid(val)))
      return value.map((val: string) => stringIdToObjectId(val));

    return value;
  });
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions],
      validator: IsObjectIdConstraint,
      async: false,
    });

    // Apply transformation
    ToObjectId(validationOptions)(target, propertyName);
  };
}
