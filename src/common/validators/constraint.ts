import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { Types } from "mongoose";

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
	validate(value: any) {
		if (value instanceof Types.ObjectId) {
			return true;
		}
		return Types.ObjectId.isValid(value);
	}

	defaultMessage() {
		return "$property must be a ObjectId";
	}
}
