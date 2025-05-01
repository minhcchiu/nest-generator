import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "~modules/pre-built/1-users/user.module";
import { WardModule } from "~modules/pre-built/10-wards/ward.module";
import { SettingModule } from "~modules/pre-built/11-settings/setting.module";
import { NotificationModule } from "~modules/pre-built/12-notifications/notification.module";
import { MenuModule } from "~modules/pre-built/4-menus/menu.module";
import { ProvinceModule } from "~modules/pre-built/8-provinces/province.module";
import { UserItem, UserItemSchema } from "~modules/user_items/schemas/user_item.schema";
import { UserItemController } from "~modules/user_items/user_item.controller";
import { UserItemService } from "~modules/user_items/user_item.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserItem.name, schema: UserItemSchema }]),
    UserModule,
    NotificationModule,
    SettingModule,
    ProvinceModule,
    MenuModule,
    WardModule,
  ],
  controllers: [UserItemController],
  providers: [UserItemService],
  exports: [UserItemService],
})
export class UserItemModule {}
