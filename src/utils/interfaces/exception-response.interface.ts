import { JSONAPIErrorOptions } from 'jsonapi-serializer';

export interface ExceptionResponse {
  readonly message: unknown;

  readonly statusCode: number;

  readonly error: string;

  readonly name: string;

  readonly errors: JSONAPIErrorOptions[];
}
