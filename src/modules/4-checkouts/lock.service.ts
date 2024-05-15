import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
@Injectable()
export class LockService {
	constructor(private readonly logger: CustomLoggerService) {}

	async acquireLock(
		productId: Types.ObjectId,
		quantity: number,
		cartId: Types.ObjectId,
		// expireTime: number = 3000,
		// maxRetries: number = 5,
	): Promise<boolean> {
		// const lockKey = `product:${productId}:lock`;
		// const lockValue = `${quantity}:${cartId}`;
		// console.log({ quantity, cartId });
		// const retries = 0		// while (retries < maxRetries) {
		// 	try {
		// 		const setnxResult = await this.redisService.setnx(lockKey, expireTime)		// 		if (setnxResult === 1) {
		// 			this.logger.log(`Lock acquired for product ${productId}`)		// 			const isReservation =
		// 				await this.inventoryService.reservationInventory({
		// 					productId,
		// 					quantity,
		// 					cartId,
		// 				})		// 			if (isReservation) {
		// 				this.redisService.pexpire(lockKey, expireTime, "NX")		// 				return true;
		// 			}

		// 			return false;
		// 		} else {
		// 			this.logger.log(
		// 				`Failed to acquire lock for product ${productId}, retrying...`,
		// 			);
		// 			retries++;
		// 			await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before retrying
		// 		}
		// 	} catch (error) {
		// 		this.logger.error(
		// 			`Error acquiring lock for product ${productId}: ${error}`,
		// 		);
		// 		return false;
		// 	}
		// }

		this.logger.log(
			`Max retries reached. Failed to acquire lock for product ${productId}, ${quantity} x ${cartId}`,
		);
		return false;
	}

	async releaseLock(productId: Types.ObjectId): Promise<void> {
		this.logger.log(productId);
		// const lockKey = `product:${productId}:lock`;
		// try {
		// 	await this.redisService.del(lockKey);
		// 	this.logger.log(`Lock released for product ${productId}`);
		// } catch (error) {
		// 	this.logger.error(
		// 		`Error releasing lock for product ${productId}: ${error}`,
		// 	);
		// }
	}
}
