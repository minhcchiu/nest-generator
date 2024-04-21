import { forwardRef, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StoreModule } from "~modules/1-stores/store.module";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
		forwardRef(() => StoreModule),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
