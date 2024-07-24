import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SystemMenu, SystemMenuSchema } from "./schemas/system-menu.schema";
import { SystemMenuController } from "./system-menu.controller";
import { SystemMenuService } from "./system-menu.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SystemMenu.name,
        schema: SystemMenuSchema,
      },
    ]),
  ],
  controllers: [SystemMenuController],
  providers: [SystemMenuService],
  exports: [SystemMenuService],
})
export class SystemMenuModule {}
