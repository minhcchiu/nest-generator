import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ResizeOptions } from "sharp";
import {
	AppConfig,
	StorageServerEnum,
} from "src/configurations/app-config.type";
import { appConfigName } from "src/configurations/app.config";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { UploadedError } from "~modules/pre-built/7-uploads/types/upload.error.type";
import { UploadedResult } from "~modules/pre-built/7-uploads/types/upload.result.type";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { compressImage } from "~utils/files/file.helper";
import { genResizeImageName } from "~utils/files/file.util";
import { ImageSize, getResizeOptions } from "../local-storage/local.service";
import { StorageService } from "../storage.service";
import { AwsConfig } from "./config/aws-config.type";
import { awsConfigName } from "./config/aws.config";

@Injectable()
export class S3Service implements StorageService {
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
	delete(resourceId: string): Promise<{ deletedAt: number; message: string }> {
		throw new Error(`"Method not implemented.", ${resourceId}`);
	}
	deleteMany(
		resourceIds: string[],
	): Promise<{ deletedAt: number; message: string }[]> {
		throw new Error(`"Method not implemented.", ${resourceIds}`);
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

	async saveFile(
		file: FileFormatted,
		imageSizes: ImageSize[] = [],
	): Promise<UploadedResult | UploadedError> {
		try {
			const fileOriginal = `${file.fileFolder}/${file.fileName}`;
			const { url, key } = await this._uploadToS3(fileOriginal, file.buffer);

			const resourceIds = [key];

			// handle image resize
			const resizeUrls: Record<string, string> = {};
			if (file.uploadType === "image" && imageSizes.length) {
				const { resizeOptions, resizeNames } = getResizeOptions(
					file.buffer,
					imageSizes,
				);

				const imagesResized = await this._resizeImages(file, resizeOptions);

				resizeNames.forEach((name, index) => {
					resizeUrls[`url${name}`] = imagesResized[index]?.url || url;

					// Add key to resource
					if (imagesResized[index]?.key)
						resourceIds.push(imagesResized[index].key);
				});
			}

			return {
				...resizeUrls,
				url,
				resourceIds,
				fileFolder: file.fileFolder,
				fileName: file.fileName,
				fileSize: file.size,
				fileType: file.mimetype,
				originalname: file.originalname,
				storageLocation: StorageLocationEnum.S3,
				uploadedAt: new Date().toISOString(),
				uploadType: file.uploadType,
				isUploadedSuccess: true,
			};
		} catch (error) {
			return {
				error: error?.message || "Local upload failed",
				originalname: file.originalname,
				fileSize: file.size,
				isUploadedSuccess: false,
			};
		}
	}

	async deleteByResourceId(resourceId: string) {
		try {
			const deleteObjectCommand = new DeleteObjectCommand({
				Bucket: this.awsConfig.bucketName,
				Key: resourceId,
			});

			const result = await this.s3Client.send(deleteObjectCommand);

			return result;
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

	private async _uploadToS3(key: string, buffer: Buffer) {
		const uploaded = new Upload({
			client: this.s3Client,
			params: {
				Bucket: this.awsConfig.bucketName,
				Key: key,
				Body: buffer,
			},
		});

		const res = await uploaded.done();

		return {
			key: res.Key,
			bucket: res.Bucket,
			url: res.Location,
		};
	}

	private async _resizeImages(
		file: FileFormatted,
		resizeOptions: ResizeOptions[] = [], // 150, 360, 480, 720
	) {
		const imagesCompressed = await compressImage(
			file.fileExt,
			file.buffer,
			resizeOptions,
		);

		const imagesResizedUrls = await Promise.all(
			resizeOptions.map((resizeOption, index) => {
				const imageName = genResizeImageName(file.fileName, resizeOption);
				const filePath = `${file.fileFolder}/${imageName}`;

				return this._uploadToS3(filePath, imagesCompressed[index]);
			}),
		);

		return imagesResizedUrls;
	}
}
