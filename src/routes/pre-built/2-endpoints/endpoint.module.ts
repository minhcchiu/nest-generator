import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EndpointGroupModule } from "../2-endpoint-groups/endpoint-group.module";

import { EndpointController } from "./endpoint.controller";
import { EndpointService } from "./endpoint.service";
import { Endpoint, EndpointSchema } from "./schemas/endpoint.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Endpoint.name,
				schema: EndpointSchema,
			},
		]),
		EndpointGroupModule,
	],
	controllers: [EndpointController],
	providers: [EndpointService],
	exports: [EndpointService],
})
export class EndpointModule {}
