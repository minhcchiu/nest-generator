import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { databaseEnv } from "src/common/database/config/database.config";
import { jwtEnv } from "~modules/pre-built/5-tokens/config/jwt.config";
import { otpEnv } from "~modules/pre-built/6-otp/config/otp.config";
import { uploadEnv } from "~modules/pre-built/7-uploads/config/upload.config";
import { mailerEnv } from "~shared/mail/config/mail.config";
import { redisEnv } from "~shared/redis-feature/config/redis.config";
import { cloudinaryEnv } from "~shared/storage/cloudinary/config/cloudinary.config";
import { awsEnv } from "~shared/storage/s3/config/aws.config";
import { appEnv } from "./app.config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				appEnv,
				awsEnv,
				cloudinaryEnv,
				databaseEnv,
				jwtEnv,
				mailerEnv,
				otpEnv,
				redisEnv,
				uploadEnv,
			],
		}),
	],
})
export class ConfigurationModule {}
