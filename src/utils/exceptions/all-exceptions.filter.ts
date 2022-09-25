import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';

import * as fs from 'fs';
import { join } from 'path';
import { Logger } from '~lazy-modules/logger/logger.service';

import {
  ErrorResponse,
  HttpExceptionResponse,
} from './http-exception-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logsDir = join(__dirname, '../../../', 'public', 'logs');
  private errorFilename = 'error.log';

  /**
   * Catch exception
   *
   * @param exception
   * @param host
   * @returns
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    // Validation exceptions
    if (exception.name === 'ValidationExceptions') {
      const errorResponse = {
        title: 'Validation Exceptions',
        errors: exception.getResponse().errors,
        error: null,
        statusCode: HttpStatus.BAD_REQUEST,
      };

      return this._responseException(errorResponse, ctx, exception);
    }

    // Http exception
    if (exception instanceof HttpException) {
      const errorResponse = {
        title: exception.getResponse()['error'],
        error: exception.message,
        errors: null,
        statusCode: exception.getStatus(),
      };

      return this._responseException(errorResponse, ctx, exception);
    }

    // Mongodb validation error
    if (exception.name === 'ValidationError') {
      const errorResponse = {
        title: 'Validation Error',
        error: null,
        errors: Object.values(exception.errors).map((val) => val['message']),
        statusCode: HttpStatus.BAD_REQUEST,
      };

      return this._responseException(errorResponse, ctx, exception);
    }

    // Mongoose bad ObjectId
    if (exception.name === 'CastError') {
      const errorResponse = {
        title: `Resource Not Found`,
        error: exception.message,
        errors: null,
        statusCode: HttpStatus.NOT_FOUND,
      };

      return this._responseException(errorResponse, ctx, exception);
    }

    const mongodbCodes = {
      bulkWriteError: 11000, // a duplicate error code in mongoose
    };

    // Mongoose duplicate key
    if (exception.code === mongodbCodes.bulkWriteError) {
      const errorResponse = {
        title: 'Duplicate Field Value Entered',
        error: exception.message,
        errors: null,
        statusCode: HttpStatus.CONFLICT,
      };

      return this._responseException(errorResponse, ctx, exception);
    }

    const errorResponse = {
      title: 'Internal Server Error',
      error: 'Critical internal server error occurred!',
      errors: null,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    // response error
    return this._responseException(errorResponse, ctx, exception);
  }

  /**
   * Response exception
   *
   * @param errorResponse
   * @param ctx
   * @param exception
   * @returns
   */
  private _responseException(
    errorResponse: ErrorResponse,
    ctx: HttpArgumentsHost,
    exception: any,
  ) {
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionResponse = this._getExceptionResponse(
      errorResponse,
      request,
    );

    // get log message string
    const errorLog = this._getErrorLog(exceptionResponse, request, exception);

    // Log in terminal
    new Logger().error(AllExceptionsFilter.name, exceptionResponse);

    // write log
    this._writeErrorLogToFile(errorLog);

    // response
    return response.status(errorResponse.statusCode).json(exceptionResponse);
  }

  /**
   * Get http exception response
   *
   * @param errorResponse
   * @param request
   * @returns
   */
  private _getExceptionResponse(
    errorResponse: ErrorResponse,
    request: Request,
  ): HttpExceptionResponse {
    return {
      ...errorResponse,
      path: request.url,
      method: request.method,
      timeStamp: new Date(),
    };
  }

  /**
   * Ger error log
   *
   * @param errorResponse
   * @param request
   * @param exception
   * @returns
   */
  private _getErrorLog = (
    errorResponse: HttpExceptionResponse,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, error, errors, method, path, title, timeStamp } =
      errorResponse;

    const errorLog = `Title: "${title}" - Code: ${statusCode} - Method: "${method}" - URL: "${path}"
    {
      message: "${error || errors}"
      timestamp: "${timeStamp}"
      User: ${JSON.stringify(request['user'] ?? 'Not signed in')}
    }
    ${
      exception instanceof HttpException ? exception.stack : error || errors
    }\n\n\n\n`;

    return errorLog;
  };

  /**
   * Write error log to file
   *
   * @param errorLog
   */
  private _writeErrorLogToFile = (errorLog: string): void => {
    const errorLogPath = `${this.logsDir}/${this.errorFilename}`;

    fs.appendFile(errorLogPath, errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };
}
