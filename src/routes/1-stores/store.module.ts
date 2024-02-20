import { UserModule } from "~routes/pre-built/1-users/user.module";

import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Store, StoreSchema } from "./schemas/store.schema";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Store.name,
				useFactory: () => {
					const schema = StoreSchema;

					// eslint-disable-next-line
					schema.plugin(require("mongoose-slug-updater"));

					return schema;
				},
			},
		]),
		forwardRef(() => UserModule),
	],
	controllers: [StoreController],
	providers: [StoreService],
	exports: [StoreService],
})
export class StoreModule {}
