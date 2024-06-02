import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserGroup, UserGroupSchema } from "./schemas/user-group.schema";
import { UserGroupController } from "./user-group.controller";
import { UserGroupService } from "./user-group.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: UserGroup.name,
				schema: UserGroupSchema,
			},
		]),
	],
	controllers: [UserGroupController],
	providers: [UserGroupService],
	exports: [UserGroupService],
})
export class UserGroupModule {}
