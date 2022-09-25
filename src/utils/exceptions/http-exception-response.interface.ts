import { HttpStatus } from '@nestjs/common';

export interface ErrorResponse {
  statusCode: HttpStatus;

  title: string;

  error: string | null;

  errors: string[] | null;
}

export interface HttpExceptionResponse extends ErrorResponse {
  path: string;

  method: string;

  timeStamp: Date;
}
