import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserGroupModule } from "../2-user-groups/user-group.module";
import { PolicyController } from "./policy.controller";
import { PolicyService } from "./policy.service";
import { Policy, PolicySchema } from "./schemas/policy.schema";
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Policy.name,
				schema: PolicySchema,
			},
		]),
		UserGroupModule,
	],
	controllers: [PolicyController],
	providers: [PolicyService],
	exports: [PolicyService],
})
export class PolicyModule {}
