// import { Injectable } from "@nestjs/common";
// import { Cron, CronExpression } from "@nestjs/schedule";
// import { CustomLoggerService } from "~shared/logger/custom-logger.service";

// @Injectable()
// export class CronService {
// 	constructor(private readonly logger: CustomLoggerService) {}

// 	@Cron(CronExpression.EVERY_MINUTE)
// 	handleCron() {
// 		this.logger.log(`Cron call at ${new Date().toLocaleString()}`);
// 	}
// }
