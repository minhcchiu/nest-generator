import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';

export class Logger implements LoggerService {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger = new ConsoleLogger();
    this.log('CustomLoggerModule init success');
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.log([message, optionalParams]);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error([message, optionalParams]);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn([message, optionalParams]);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug([message, optionalParams]);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose([message, optionalParams]);
  }
  setLogLevels?(levels: LogLevel[]) {
    this.logger.setLogLevels(levels);
  }
  setContext(context: string) {
    this.logger.setContext(context);
  }
}
