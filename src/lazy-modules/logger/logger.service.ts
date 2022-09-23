import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';

export class Logger implements LoggerService {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger = new ConsoleLogger();
    this.log('CustomLoggerModule init success');
  }

  /**
   * Log info
   *
   * @param message
   * @param optionalParams
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.log([message, optionalParams]);
  }

  /**
   * Log error
   *
   * @param message
   * @param optionalParams
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error([message, optionalParams]);
  }

  /**
   * Log warning
   *
   * @param message
   * @param optionalParams
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn([message, optionalParams]);
  }

  /**
   * Log debug
   *
   * @param message
   * @param optionalParams
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug([message, optionalParams]);
  }

  /**
   * Log verbose
   *
   * @param message
   * @param optionalParams
   */
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose([message, optionalParams]);
  }

  /**
   * Set log levels
   *
   * @param levels
   */
  setLogLevels?(levels: LogLevel[]) {
    this.logger.setLogLevels(levels);
  }

  /**
   * Set conext
   *
   * @param context
   */
  setContext(context: string) {
    this.logger.setContext(context);
  }
}
