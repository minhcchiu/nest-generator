import { BadRequestException, ValidationError } from "@nestjs/common";
import { ErrorDetail } from "~types/error-detail.type";

function transform(errors: ValidationError[]): ErrorDetail[] {
	return errors.map((error) => {
		return {
			value: error.value || undefined,
			property: error.property || undefined,
			children: error.children?.length ? transform(error.children) : undefined,
			error: error.constraints
				? Object.values(error.constraints)[0]
				: undefined,
		};
	});
}

export class ValidationExceptions extends BadRequestException {
	constructor(public validationErrors: ValidationError[]) {
		super({
			errorType: "ValidationError",
			errors: transform(validationErrors),
		});
	}
}
