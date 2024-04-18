import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Injectable } from "@nestjs/common";
import { ResizeOptions } from "sharp";
import { StorageServerEnum } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/static.env";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { UploadedResult } from "~modules/pre-built/7-uploads/types/upload.result.type";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { compressImage } from "~utils/files/file.helper";
import { genResizeImageName } from "~utils/files/file.util";
import { ImageSize, getResizeOptions } from "../local-storage/local.service";
import { StorageService } from "../storage.service";

@Injectable()
export class S3Service implements StorageService {
	private s3Client: S3Client;

	constructor(private readonly logger: CustomLoggerService) {
		this.initS3();
	}

	initS3() {
		if (EnvStatic.getAppConfig().storageServer !== StorageServerEnum.S3) {
			this.logger.warn("S3Module module was not initialized", S3Service.name);
			return;
		}

		const awsConfig = EnvStatic.getAwsConfig();

		this.s3Client = new S3Client({
			region: awsConfig.region,
			endpoint: awsConfig.endpoint,
			credentials: {
				accessKeyId: awsConfig.accessKeyId,
				secretAccessKey: awsConfig.secretAccessKey,
			},
		});

		this.logger.log("S3Module init success", S3Service.name);
	}

	async saveFile(
		file: FileFormatted,
		imageSizes: ImageSize[] = [],
	): Promise<UploadedResult> {
		const fileOriginal = `${file.fileFolder}/${file.fileName}`;
		const { url, key } = await this._uploadToS3(fileOriginal, file.buffer);

		const resourceIds = [key];

		// handle image resize
		const resizeUrls: Record<string, string> = {};
		if (file.resourceType === ResourceTypeEnum.Image && imageSizes.length) {
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
			resourceType: file.resourceType,
		};
	}

	delete(resourceId: string): Promise<{ deletedAt: number; message: string }> {
		throw new Error(`"Method not implemented.", ${resourceId}`);
	}

	deleteMany(
		resourceIds: string[],
	): Promise<{ deletedAt: number; message: string }[]> {
		throw new Error(`"Method not implemented.", ${resourceIds}`);
	}

	async deleteByResourceId(resourceId: string) {
		try {
			const deleteObjectCommand = new DeleteObjectCommand({
				Bucket: EnvStatic.getAwsConfig().bucketName,
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
				Bucket: EnvStatic.getAwsConfig().bucketName,
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
