import { Transform } from "class-transformer";
import { Types } from "mongoose";

import { registerDecorator, ValidationOptions } from "class-validator";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { IsObjectIdConstraint } from "./constraint";

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

export function ToObjectId(options: { each?: boolean } = { each: false }) {
	return Transform(({ value }) => {
		if (typeof value === "string" && Types.ObjectId.isValid(value))
			return stringIdToObjectId(value);

		if (
			options?.each &&
			Array.isArray(value) &&
			value.length > 0 &&
			value.every(
				(val) => typeof val === "string" && Types.ObjectId.isValid(val),
			)
		)
			return value.map((val: string) => stringIdToObjectId(val));

		return value;
	});
}
