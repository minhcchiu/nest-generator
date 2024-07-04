import { Transform } from "class-transformer";
import { Types } from "mongoose";

import { registerDecorator, ValidationOptions } from "class-validator";
import { IsObjectIdConstraint } from "./objectId-constraint";

export function IsObjectId(validationOptions?: ValidationOptions) {
	return function (ob: object, propertyName: string) {
		registerDecorator({
			target: ob.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsObjectIdConstraint,
		});
	};
}

export function ToObjectId() {
	return Transform(({ value }) => {
		if (typeof value === "string" && Types.ObjectId.isValid(value))
			return new Types.ObjectId(value);

		return value;
	});
}
