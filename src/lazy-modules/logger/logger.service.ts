import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';

export class Logger implements LoggerService {
  constructor(private readonly logger?: ConsoleLogger) {
    this.logger = new ConsoleLogger();
    this.log('Logger', 'CustomLoggerModule init success');
  }

  /**
   * Log info
   *
   * @param context
   * @param messages
   */
  log(context: string, ...messages: any[]) {
    const _names = messages.map((item: any) =>
      JSON.stringify(item, null, '\t'),
    );

    const messageFinal = `${_names.join('\n')}`;

    this.logger.setContext(context);
    this.logger.log(messageFinal);
  }

  /**
   * Log error
   *
   * @param context
   * @param messages
   */
  error(context: string, ...messages: any[]) {
    const _names = messages.map((item: any) =>
      JSON.stringify(item, null, '\t'),
    );
    const messageFinal = `${_names.join('\n')}`;

    this.logger.setContext(context);
    this.logger.error(messageFinal);
  }

  /**
   * Log warning
   *
   * @param context
   * @param messages
   */
  warn(context: string, ...messages: any[]) {
    const _names = messages.map((item: any) =>
      JSON.stringify(item, null, '\t'),
    );
    const messageFinal = `${_names.join('\n')}`;

    this.logger.setContext(context);
    this.logger.warn(messageFinal);
  }

  /**
   * Log debug
   *
   * @param context
   * @param messages
   */
  debug(context: string, ...messages: any[]) {
    const _names = messages.map((item: any) =>
      JSON.stringify(item, null, '\t'),
    );
    const messageFinal = `${_names.join('\n')}`;

    this.logger.setContext(context);
    this.logger.debug(messageFinal);
  }

  /**
   * Log verbose
   *
   * @param context
   * @param messages
   */
  verbose(context: string, ...messages: any[]) {
    const _names = messages.map((item: any) =>
      JSON.stringify(item, null, '\t'),
    );
    const messageFinal = `${_names.join('\n')}`;

    this.logger.setContext(context);
    this.logger.verbose(messageFinal);
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
