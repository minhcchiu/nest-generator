import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { AllExceptionsFilter } from "~exceptions/all-exception.filter";
import { VALIDATION_PIPE_OPTIONS } from "../utils/common.constants";

@Module({
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
		},
		{
			provide: APP_FILTER,
			useValue: new AllExceptionsFilter(),
		},
	],
})
export class CommonModule {}
