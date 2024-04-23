import { IsNotEmpty, IsString } from "class-validator";

export class AwsConfigDto {
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

	@IsNotEmpty()
	@IsString()
	S3_CLOUD_FONT: string;
}
