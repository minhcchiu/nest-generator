import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserGroupModule } from "../2-user-groups/user-group.module";
import { PolicyGroupController } from "./policy-group.controller";
import { PolicyGroupService } from "./policy-group.service";
import { PolicyGroup, PolicyGroupSchema } from "./schemas/policy-group.schema";
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: PolicyGroup.name,
				schema: PolicyGroupSchema,
			},
		]),
		UserGroupModule,
	],
	controllers: [PolicyGroupController],
	providers: [PolicyGroupService],
	exports: [PolicyGroupService],
})
export class PolicyGroupModule {}
