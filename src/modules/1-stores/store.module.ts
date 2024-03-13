import { UserModule } from "~pre-built/1-users/user.module";

import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Store, StoreSchema } from "./schemas/store.schema";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Store.name,
				schema: StoreSchema,
			},
		]),
		forwardRef(() => UserModule),
	],
	controllers: [StoreController],
	providers: [StoreService],
	exports: [StoreService],
})
export class StoreModule {}
