import { BadRequestException, Controller, Get } from "@nestjs/common";
import * as AsyncLock from "async-lock";
import { Public } from "~decorators/public.decorator";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { ChannelName } from "~shared/redis-feature/channel";
import { RedisService } from "~shared/redis-feature/redis.service";

const product = {
	quantity: 2,
	name: "Áo sơ mi",
};

@Controller("apps")
export class AppController {
	private lock: AsyncLock;
	constructor(
		private readonly redisFeatureService: RedisService,
		private readonly loggerService: CustomLoggerService,
	) {
		this.lock = new AsyncLock();
	}

	@Public()
	@Get("testLock")
	async testLock() {
		// const res1 = await this.processRequest(1);
		// this.loggerService.log({ res1 });
		// const res2 = await this.processRequest(2);
		// this.loggerService.log({ res1, res2 });
		// const res = await Promise.allSettled([
		// 	this.processRequest(3),
		// 	this.processRequest(4),
		// 	this.processRequest(5),
		// 	this.processRequest(6),
		// ]);
		// return res1;
	}

	async processRequest(request: string) {
		await this.lock.acquire(request, async () => {
			this.loggerService.log(`--------------Request ${request} lockAquired`);
			// Simulating processing time
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (product.quantity <= 0) {
				throw new BadRequestException("Out of stock");
			}

			this.loggerService.log(`--------------Request ${request} Done`);

			product.quantity += -1;
		});

		this.loggerService.log(`--------------Request ${request} lockReleased`);
		return product;
	}

	@Get("publish")
	async publish() {
		await this.redisFeatureService.publishMessage(
			ChannelName.Order,
			"Hello from Order!",
		);
		return "Message published";
	}

	@Public()
	@Get("publish2")
	async publish2() {
		await this.redisFeatureService.publishMessage(
			ChannelName.Test,
			"Hello from Test!",
		);
		return "Message published";
	}

	@Public()
	@Get("publish3")
	async publish3() {
		await this.redisFeatureService.publishMessage(
			ChannelName.Test2,
			"Hello from Test!",
		);
		return "Message published";
	}

	@Public()
	@Get("subscribe")
	async subscribe() {
		this.redisFeatureService.subscribeToChannel(
			ChannelName.Order,
			(message) => {
				this.loggerService.log("Received message:", message);
			},
		);
		return "Subscribed to channel";
	}

	@Public()
	@Get("subscribe1")
	async subscribe1() {
		this.redisFeatureService.subscribeToChannel(ChannelName.Test, (message) => {
			this.loggerService.log("Received message:", message);
		});
		return "Subscribed to channel";
	}

	@Public()
	@Get("subscribe2")
	async subscribe2() {
		this.redisFeatureService.subscribeToChannel(
			ChannelName.Test2,
			(message) => {
				this.loggerService.log("Received message:", message);
			},
		);
		return "Subscribed to channel";
	}
}
