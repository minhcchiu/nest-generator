import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ProvinceController } from "./province.controller";
import { ProvinceService } from "./province.service";
import { Province, ProvinceSchema } from "./schemas/province.schema";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Province.name,
				useFactory: () => {
					const schema = ProvinceSchema;

					// eslint-disable-next-line
          schema.plugin(require('mongoose-slug-updater'));

					return schema;
				},
			},
		]),
	],
	controllers: [ProvinceController],
	providers: [ProvinceService],
	exports: [ProvinceService],
})
export class ProvinceModule {}
