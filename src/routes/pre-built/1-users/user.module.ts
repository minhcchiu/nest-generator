import { StoreModule } from "~routes/1-stores/store.module";

import { forwardRef, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserFirebaseService } from "./user-firebase/user-firebase.service";

@Global()
@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UserSchema;

					// eslint-disable-next-line
					schema.plugin(require("mongoose-slug-updater"));

					return schema;
				},
			},
		]),
		forwardRef(() => StoreModule),
	],
	controllers: [UserController],
	providers: [UserService, UserFirebaseService],
	exports: [UserService, UserFirebaseService],
})
export class UserModule {}
