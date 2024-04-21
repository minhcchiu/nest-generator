import { ValidationPipeOptions } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { ValidationExceptions } from "~exceptions/validation.exceptions";

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
	whitelist: true,
	forbidNonWhitelisted: true,
	transform: true,
	exceptionFactory: (errors: ValidationError[]) =>
		new ValidationExceptions(errors),
};
