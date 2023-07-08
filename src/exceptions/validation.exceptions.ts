import { BadRequestException, ValidationError } from "@nestjs/common";

function transform(errors: ValidationError[]) {
	return errors.map((error) =>
		error.constraints ? Object.values(error.constraints)[0] : null,
	);
}

export class ValidationExceptions extends BadRequestException {
	constructor(public validationErrors: ValidationError[]) {
		super({
			errorType: "ValidationError",
			errors: transform(validationErrors),
		});
	}
}
