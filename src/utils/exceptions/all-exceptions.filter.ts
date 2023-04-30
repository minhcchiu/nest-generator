import { Request, Response } from 'express';
import { writeErrorLogToFile } from 'src/helpers/file.helper';

import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { HttpExceptionResponse } from './http-exception-response.interface';

enum ExceptionType {
  ValidationExceptions = 'ValidationExceptions',
  ValidationError = 'ValidationError',
  CastError = 'CastError',
}

const MONGODB_CODES = {
  BULK_WRITE_ERROR: 11000, // a duplicate error code in mongoose
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const httpHost = host.switchToHttp();
    const response = httpHost.getResponse<Response>();
    const request = httpHost.getRequest<Request>();
    const url = request.url;
    const method = request.method;

    const errorMessage = exception?.message || 'Critical internal server error occurred!';
    const title =
      exception instanceof HttpException
        ? exception.getResponse()['error']
        : 'Internal Server Error';
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: HttpExceptionResponse = {
      title,
      statusCode,
      url,
      method,
      details: [errorMessage],
      timeStamp: new Date(),
      user: JSON.stringify(request['user']) ?? 'Not signed in',
      stack: exception?.stack,
    };

    switch (exception.name) {
      case ExceptionType.ValidationExceptions:
        exceptionResponse.title = 'Validation Exceptions';
        exceptionResponse.details = exception.getResponse().errors;
        exceptionResponse.statusCode = HttpStatus.BAD_REQUEST;
        break;

      case ExceptionType.ValidationError:
        exceptionResponse.title = 'Validation Error';
        exceptionResponse.details = Object.values(exception.errors).map((val) => val['message']);
        exceptionResponse.statusCode = HttpStatus.BAD_REQUEST;
        break;

      case ExceptionType.CastError:
        exceptionResponse.title = `Resource Not Found`;
        exceptionResponse.statusCode = HttpStatus.NOT_FOUND;
        break;
      default:
        if (exception.code === MONGODB_CODES.BULK_WRITE_ERROR) {
          exceptionResponse.title = 'Duplicate Field Value Entered';
          exceptionResponse.statusCode = HttpStatus.CONFLICT;
        }
        break;
    }

    const prodErrorResponse = {
      title: exceptionResponse.title,
      details: exceptionResponse.details,
    };

    this.logException(exceptionResponse?.stack);
    writeErrorLogToFile(exceptionResponse);

    return response.status(exceptionResponse.statusCode).json(prodErrorResponse);
  }

  private logException(exceptionStack?: any) {
    new ConsoleLogger().error(exceptionStack);
  }
}
