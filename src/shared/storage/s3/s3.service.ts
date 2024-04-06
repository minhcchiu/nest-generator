import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";

import {
	AppConfig,
	StorageServerEnum,
} from "src/configurations/app-config.type";
import { appConfigName } from "src/configurations/app.config";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { AwsConfig } from "./config/aws-config.type";
import { awsConfigName } from "./config/aws.config";

@Injectable()
export class S3Service {
	private s3Client: S3Client;
	private awsConfig: AwsConfig;
	private appConfig: AppConfig;

	constructor(
		private readonly configService: ConfigService,
		private logger: CustomLoggerService,
	) {
		this.awsConfig = this.configService.get<AwsConfig>(awsConfigName);
		this.appConfig = this.configService.get<AppConfig>(appConfigName);

		this.initS3();
	}

	initS3() {
		if (this.appConfig.storageServer !== StorageServerEnum.S3) {
			this.logger.warn("S3Module module was not initialized", S3Service.name);
			return;
		}

		this.s3Client = new S3Client({
			region: this.awsConfig.region,
			endpoint: this.awsConfig.endpoint,
			credentials: {
				accessKeyId: this.awsConfig.accessKeyId,
				secretAccessKey: this.awsConfig.secretAccessKey,
			},
		});

		this.logger.log("S3Module init success", S3Service.name);
	}

	async upload(file: { fileName: string; fileFolder: string; buffer: Buffer }) {
		const upload = new Upload({
			params: {
				Bucket: this.awsConfig.bucketName,
				Key: `${file.fileFolder}/${file.fileName}`,
				Body: Readable.from(file.buffer),
			},
			client: this.s3Client,
			queueSize: 3,
		});

		return upload.done();
	}

	async deleteByResourceId(resourceId: string) {
		try {
			const deleteObjectCommand = new DeleteObjectCommand({
				Bucket: this.awsConfig.bucketName,
				Key: resourceId,
			});

			const result = await this.s3Client.send(deleteObjectCommand);

			console.log(
				`File ${resourceId} deleted successfully from S3 bucket ${this.awsConfig.bucketName}.`,
			);

			console.log(result);
		} catch (error) {
			this.logger.warn(S3Service.name, error);
			throw error;
		}
	}

	async deleteByResourceIds(publicIds: string[]) {
		try {
			return Promise.all(
				publicIds.map((publicId) => this.deleteByResourceId(publicId)),
			);
		} catch (error) {
			this.logger.warn(S3Service.name, error);
		}
	}
}
