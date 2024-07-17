import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MenuGroupController } from "./menu-group.controller";
import { MenuGroupService } from "./menu-group.service";
import { MenuGroup, MenuGroupSchema } from "./schemas/menu-group.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MenuGroup.name,
        schema: MenuGroupSchema,
      },
    ]),
  ],
  controllers: [MenuGroupController],
  providers: [MenuGroupService],
  exports: [MenuGroupService],
})
export class MenuGroupModule {}
