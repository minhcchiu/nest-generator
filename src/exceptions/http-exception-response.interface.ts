import { HttpStatus } from "@nestjs/common";

export interface ErrorResponse {
	errors?: any[] | null;

	statusCode: HttpStatus;

	title: string;
}

export interface HttpExceptionResponse extends ErrorResponse {
	url: string;

	method: string;

	timeStamp: Date;

	user?: string;

	stack?: any;
}
