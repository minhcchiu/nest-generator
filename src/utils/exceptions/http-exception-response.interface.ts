import { HttpStatus } from '@nestjs/common';

export interface ErrorResponse {
  error: string | null;

  errors: string[] | null;

  statusCode: HttpStatus;

  title: string;
}

export interface HttpExceptionResponse extends ErrorResponse {
  path: string;

  method: string;

  timeStamp: Date;
}
