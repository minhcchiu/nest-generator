import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Setting, SettingSchema } from "~modules/pre-built/11-settings/schemas/setting.schema";
import { SettingController } from "~modules/pre-built/11-settings/setting.controller";
import { SettingService } from "~modules/pre-built/11-settings/setting.service";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }])],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
