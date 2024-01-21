import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PermissionModule } from "../2-permissions/permission.module";
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
		PermissionModule,
	],
	controllers: [EndpointController],
	providers: [EndpointService],
	exports: [EndpointService],
})
export class EndpointModule {}
