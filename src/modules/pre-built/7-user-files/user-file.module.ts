import { MailModule } from "~shared/mail/mail.module";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { UserFile, UserFileSchema } from "./schemas/user-file.schema";
import { UserFileController } from "./user-file.controller";
import { UserFileService } from "./user-file.service";

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{
				name: UserFile.name,
				schema: UserFileSchema,
			},
		]),
		MailModule,
	],
	controllers: [UserFileController],
	providers: [UserFileService],
	exports: [UserFileService],
})
export class UserFileModule {}
