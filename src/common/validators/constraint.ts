import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ObjectId } from "mongodb";

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value instanceof ObjectId) {
      return true;
    }
    return ObjectId.isValid(value);
  }

  defaultMessage() {
    return "$property must be a ObjectId";
  }
}
