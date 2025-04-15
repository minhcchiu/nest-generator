import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "~modules/pre-built/1-users/user.module";
import { NotificationModule } from "~modules/pre-built/12-notifications/notification.module";
import { UserItem, UserItemSchema } from "~modules/user_items/schemas/user_item.schema";
import { UserItemController } from "~modules/user_items/user_item.controller";
import { UserItemService } from "~modules/user_items/user_item.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserItem.name, schema: UserItemSchema }]),
    UserModule,
    NotificationModule,
  ],
  controllers: [UserItemController],
  providers: [UserItemService],
  exports: [UserItemService],
})
export class UserItemModule {}
