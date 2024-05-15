import { ConsoleLogger, LoggerService, LogLevel } from "@nestjs/common";

export class CustomLoggerService implements LoggerService {
	constructor(private readonly logger?: ConsoleLogger) {
		this.logger = new ConsoleLogger();
		this.log("CustomCustomLogg init success", "CustomLoggerService");
	}

	/**
	 * Log info
	 *
	 * @param context
	 * @param messages
	 */
	log(messages: any, context?: string) {
		const _names = Array.isArray(messages)
			? messages.map((item: any) => JSON.stringify(item, null, "\t"))
			: [messages];

		const messageFinal = `${_names.join("\n")}`;

		this.logger.setContext(context);
		this.logger.log(messageFinal);
	}

	/**
	 * Log error
	 *
	 * @param context
	 * @param messages
	 */
	error(messages: any, context?: string) {
		const _names = Array.isArray(messages)
			? messages.map((item: any) => JSON.stringify(item, null, "\t"))
			: [messages];
		const messageFinal = `${_names.join("\n")}`;

		this.logger.setContext(context);
		this.logger.error(messageFinal);
	}

	/**
	 * Log warning
	 *
	 * @param context
	 * @param messages
	 */
	warn(messages: any, context?: string) {
		const _names = Array.isArray(messages)
			? messages.map((item: any) => JSON.stringify(item, null, "\t"))
			: [messages];
		const messageFinal = `${_names.join("\n")}`;

		this.logger.setContext(context);
		this.logger.warn(messageFinal);
	}

	/**
	 * Log debug
	 *
	 * @param context
	 * @param messages
	 */
	debug(messages: any, context?: string) {
		const _names = Array.isArray(messages)
			? messages.map((item: any) => JSON.stringify(item, null, "\t"))
			: [messages];
		const messageFinal = `${_names.join("\n")}`;

		this.logger.setContext(context);
		this.logger.debug(messageFinal);
	}

	/**
	 * Log verbose
	 *
	 * @param context
	 * @param messages
	 */
	verbose(messages: any, context?: string) {
		const _names = Array.isArray(messages)
			? messages.map((item: any) => JSON.stringify(item, null, "\t"))
			: [messages];
		const messageFinal = `${_names.join("\n")}`;

		this.logger.setContext(context);
		this.logger.verbose(messageFinal);
	}

	/**
	 * write log to file
	 *
	 * @param context
	 * @param messages
	 */
	writeLog(messages: any, context?: string) {
		const _names = Array.isArray(messages)
			? messages.map((item: any) => JSON.stringify(item, null, "\t"))
			: [messages];

		const messageFinal = `${_names.join("\n")}`;

		this.logger.setContext(context);
		this.logger.log(messageFinal);
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
	 * Set context
	 *
	 * @param context
	 */
	setContext(context: string) {
		this.logger.setContext(context);
	}
}
