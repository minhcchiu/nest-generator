import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { ObjectId } from "mongodb";

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments) {
    const options = args.constraints[0] || {};

    // Check 'each' option is true
    if (options.each) {
      const obj = args.object;
      if (!Array.isArray(obj[args.property])) return false; // Not an array

      return obj[args.property].every(val => val instanceof ObjectId || ObjectId.isValid(val)); // Check each item is ObjectId
    }

    if (value instanceof ObjectId) return true;

    return ObjectId.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    const options = args.constraints[0] || {};

    // Check 'each' option is true and not an array
    if (options.each && !Array.isArray(args.object[args.property])) {
      return `${args.property} must be an array of valid ObjectIds`;
    }

    return "$property must be a ObjectId";
  }
}
