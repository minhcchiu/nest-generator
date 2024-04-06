import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { jwtEnv } from "~modules/pre-built/5-tokens/config/jwt.config";
import { mailerEnv } from "~shared/mail/config/mail.config";
import { redisEnv } from "~shared/redis-feature/config/redis.config";
import { appEnv } from "./environment/app.config";
import { awsEnv } from "./environment/aws.config";
import { clientUrlEnv } from "./environment/client-url.config";
import { cloudinaryEnv } from "./environment/cloudinary.config";
import { databaseEnv } from "./environment/database.config";
import { otpEnv } from "./environment/otp.config";
import { uploadEnv } from "./environment/upload.config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				appEnv,
				awsEnv,
				clientUrlEnv,
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
