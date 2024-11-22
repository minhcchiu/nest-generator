import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TagFollower, TagFollowerSchema } from "./schemas/tag_follower.schema";
import { TagFollowerController } from "./tag_follower.controller";
import { TagFollowerService } from "./tag_follower.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TagFollower.name,
        schema: TagFollowerSchema,
      },
    ]),
  ],
  controllers: [TagFollowerController],
  providers: [TagFollowerService],
  exports: [TagFollowerService],
})
export class TagFollowerModule {}
