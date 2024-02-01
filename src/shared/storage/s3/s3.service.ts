import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig, AwsConfig, ConfigName } from "~config/environment";
import { CustomLogger } from "~shared/logger/logger.service";
import { Body } from "aws-sdk/clients/s3";
import { S3 } from "aws-sdk";

@Injectable()
export class S3Service {
	private s3: S3;
	private awsConfig: AwsConfig;
	private appConfig: AppConfig;

	constructor(
		private readonly configService: ConfigService,
		private logger: CustomLogger,
	) {
		this.awsConfig = this.configService.get<AwsConfig>(ConfigName.aws);
		this.appConfig = this.configService.get<AppConfig>(ConfigName.app);

		this.initS3();
	}

	initS3() {
		if (this.appConfig.storageServer === "S3") {
			this.s3 = new S3({
				accessKeyId: this.awsConfig.accessKeyId,
				secretAccessKey: this.awsConfig.secretAccessKey,
				region: this.awsConfig.region,
				endpoint: this.awsConfig.endpoint,
				correctClockSkew: true,
			});

			this.logger.log("S3Module init success", S3Service.name);

			return;
		}

		this.logger.warn("S3Module module was not init", S3Service.name);
	}

	async upload(file: {
		fileName: string;
		mimetype: string;
		body: Body;
	}): Promise<S3.ManagedUpload.SendData> {
		const params: S3.PutObjectRequest = {
			Key: file.fileName,
			ContentType: file.mimetype,
			Body: file.body,

			Bucket: this.awsConfig.bucketName,
		};

		return this.s3.upload(params).promise();
	}
}
