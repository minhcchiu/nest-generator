import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { AwsConfig } from "./aws-config.type";

export const awsConfigName = "aws";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsString()
	S3_ACCESS_KEY: string;

	@IsNotEmpty()
	@IsString()
	S3_SECRET_ACCESS_KEY: string;

	@IsNotEmpty()
	@IsString()
	S3_REGION: string;

	@IsNotEmpty()
	@IsString()
	S3_ENDPOINT: string;

	@IsNotEmpty()
	@IsString()
	S3_BUCKET_NAME: string;
}

export const awsEnv = registerAs(awsConfigName, (): AwsConfig => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		region: process.env.S3_REGION,
		endpoint: process.env.S3_ENDPOINT,
		bucketName: process.env.S3_BUCKET_NAME,
	};
});
