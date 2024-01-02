import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Setting, SettingSchema } from "./schemas/setting.schema";
import { SettingController } from "./setting.controller";
import { SettingService } from "./setting.service";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Setting.name,
				useFactory: () => {
					const schema = SettingSchema;

					// eslint-disable-next-line
					schema.plugin(require("mongoose-slug-updater"));

					return schema;
				},
			},
		]),
	],
	controllers: [SettingController],
	providers: [SettingService],
	exports: [SettingService],
})
export class SettingModule {}
