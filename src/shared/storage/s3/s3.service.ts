import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { Upload } from "@aws-sdk/lib-storage";
import { Injectable } from "@nestjs/common";
import { ResizeOptions } from "sharp";
import { StorageServerEnum } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/static.env";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { FileUploaded } from "~modules/pre-built/7-uploads/types/upload.result.type";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import {
	ImageSize,
	compressImage,
	genResizeImageName,
	getResizeOptions,
} from "~utils/image.util";

@Injectable()
export class S3Service {
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
	): Promise<FileUploaded> {
		const fileOriginal = `${file.fileFolder}/${file.fileName}`;
		const { url, key } = await this._uploadToS3(fileOriginal, file.buffer);

		const resourceKeys = [key];

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
					resourceKeys.push(imagesResized[index].key);
			});
		}

		return {
			...resizeUrls,
			url,
			resourceKeys,
			fileFolder: file.fileFolder,
			fileName: file.fileName,
			fileSize: file.size,
			fileType: file.mimetype,
			originalname: file.originalname,
			storageLocation: StorageLocationEnum.S3,
			resourceType: file.resourceType,
		};
	}

	async deleteByKey(resourceKey: string) {
		await this._deleteFromS3(resourceKey);
	}

	async deleteManyByKeys(resourceKeys: string[]) {
		await Promise.all(resourceKeys.map((item) => this.deleteByKey(item)));
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

		const url = `${EnvStatic.getAwsConfig().cloudFont}/${res.Key}`;

		// const signedUrl = getSignedUrl({
		// 	url,
		// 	keyPairId: EnvStatic.getAwsConfig().cloudFontKeyPairId,
		// 	privateKey: EnvStatic.getAwsConfig().cloudFontPrivateKey,
		// 	dateLessThan: "2022-04-04",
		// });

		// console.log({ signedUrl });

		return {
			key: res.Key,
			bucket: res.Bucket,
			url,
		};
	}

	private async _deleteFromS3(key: string) {
		const deleteObjectCommand = new DeleteObjectCommand({
			Bucket: EnvStatic.getAwsConfig().bucketName,
			Key: key,
		});

		const deleted = await this.s3Client.send(deleteObjectCommand);

		return deleted;
	}
}
