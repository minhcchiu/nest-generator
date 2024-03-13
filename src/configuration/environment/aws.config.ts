import { registerAs } from "@nestjs/config";

export const awsConfigName = "aws";

export type AwsConfig = {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	endpoint: string;
	bucketName: string;
};

export const awsEnv = registerAs(
	awsConfigName,
	(): AwsConfig => ({
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		region: process.env.S3_REGION,
		endpoint: process.env.S3_ENDPOINT,
		bucketName: process.env.S3_BUCKET_NAME,
	}),
);
