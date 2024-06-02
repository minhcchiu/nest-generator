import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Setting, SettingSchema } from "./schemas/setting.schema";
import { SettingController } from "./setting.controller";
import { SettingService } from "./setting.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
	],
	controllers: [SettingController],
	providers: [SettingService],
	exports: [SettingService],
})
export class SettingModule {}
