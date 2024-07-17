import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
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
  ],
  controllers: [PolicyController],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PolicyModule {}
