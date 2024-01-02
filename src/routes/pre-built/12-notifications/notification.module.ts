import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
	Notification,
	NotificationSchema,
} from "./schemas/notification.schema";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Notification.name,
				useFactory: () => {
					const schema = NotificationSchema;

					// eslint-disable-next-line
					schema.plugin(require("mongoose-slug-updater"));

					return schema;
				},
			},
		]),
	],
	controllers: [NotificationController],
	providers: [NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
