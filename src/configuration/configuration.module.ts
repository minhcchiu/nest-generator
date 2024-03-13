import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appEnv } from "./environment/app.config";
import { awsEnv } from "./environment/aws.config";
import { clientUrlEnv } from "./environment/client-url.config";
import { cloudinaryEnv } from "./environment/cloudinary.config";
import { databaseEnv } from "./environment/database.config";
import { jwtEnv } from "./environment/jwt.config";
import { mailerEnv } from "./environment/mailer.config";
import { otpEnv } from "./environment/otp.config";
import { redisEnv } from "./environment/redis.config";
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
