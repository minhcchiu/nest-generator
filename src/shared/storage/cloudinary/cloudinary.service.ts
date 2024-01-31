import { UploadApiOptions, v2 } from "cloudinary";
import { unlinkSync } from "fs";
import { CloudinaryConfig, ConfigName } from "~config/environment";
import { ResourceTypeEnum } from "~routes/pre-built/7-uploads/enum/resource-type.enum";
import { CustomLogger } from "~shared/logger/logger.service";
import { getFileName } from "~utils/file.util";
import { FileType } from "~utils/types/file.type";

import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { cloudinaryHelper } from "./cloudinary.helper";

@Injectable()
export class CloudinaryService {
	private readonly cloudinaryConfig: CloudinaryConfig;

	private uploadOptions = {
		[ResourceTypeEnum.IMAGE]: this._uploadImage,
		[ResourceTypeEnum.FILE]: this._uploadFile,
		[ResourceTypeEnum.AUTO]: this._uploadAudio,
		[ResourceTypeEnum.VIDEO]: this._uploadVideo,
	};

	constructor(
		readonly configService: ConfigService,
		private readonly logger: CustomLogger,
	) {
		this.cloudinaryConfig = configService.get<CloudinaryConfig>(
			ConfigName.cloudinary,
		);
	}

	/**
	 * Upload image
	 *
	 * @param filePath
	 * @param options
	 * @returns
	 */
	uploadImage(
		file: Express.Multer.File,
		options: {
			fileName: string;
			fileType: FileType;
			fileFolder: string;
		},
	): Promise<any> {
		return new Promise((resolve, reject) => {
			v2.uploader
				.upload_stream(
					{
						resource_type: options.fileType,
						folder: options.fileFolder,
						public_id: options.fileName,
					},
					(error, uploadResult) => {
						if (error) return reject(new BadRequestException(error.message));

						return resolve(uploadResult);
					},
				)
				.end(file.buffer);
		});
	}

	/**
	 * Upload
	 *
	 * @param filePath
	 * @param resourceType
	 * @returns
	 */
	async upload(filePath: string, resourceType: ResourceTypeEnum): Promise<any> {
		const fName = getFileName(filePath);

		const options = {
			folder: this.cloudinaryConfig.options.folder,
			public_id: `${resourceType}s/${fName}`,
		};

		return this.uploadOptions[resourceType](filePath, options);
	}

	/**
	 * Delete many
	 *
	 * @param publicIds
	 * @returns
	 */
	deleteByResourceIds(publicIds: string[]) {
		return v2.api.delete_resources(publicIds);
	}

	/**
	 * Delete one
	 *
	 * @param publicId
	 * @returns
	 */
	async deleteByResourceId(publicId: string) {
		try {
			return await v2.uploader.destroy(publicId);
		} catch (error) {
			this.logger.warn(CloudinaryService.name, error);
		}
	}

	/**
	 * Upload image
	 *
	 * @param filePath
	 * @param options
	 * @returns
	 */
	private _uploadImage(filePath: string, options: UploadApiOptions): any {
		options.resource_type = "image";

		return new Promise((resolve, reject) => {
			v2.uploader.upload(filePath, options, (err, file) => {
				if (err) return reject(new BadRequestException(err.message));

				// remove file in temp
				unlinkSync(filePath);

				const files = cloudinaryHelper.generateImagesResize(
					file.url,
					file.public_id,
				);

				return resolve(cloudinaryHelper.getUploadResult({ ...file, files }));
			});
		});
	}

	/**
	 * Upload file
	 *
	 * @param filePath
	 * @param options
	 * @returns
	 */
	private _uploadFile(filePath: string, options: UploadApiOptions): any {
		options.resource_type = "raw";

		return new Promise((resolve, reject) => {
			v2.uploader.upload(filePath, options, (err, file) => {
				if (err) return reject(new BadRequestException(err.message));

				// remove file in temp
				unlinkSync(filePath);

				return resolve(
					cloudinaryHelper.getUploadResult({ ...file, files: [file.url] }),
				);
			});
		});
	}

	/**
	 * Upload auto
	 *
	 * @param filePath
	 * @param options
	 * @returns
	 */
	private _uploadAudio(filePath: string, options: UploadApiOptions): any {
		options.resource_type = "raw";

		return new Promise((resolve, reject) => {
			v2.uploader.upload(filePath, options, (err, file) => {
				if (err) return reject(new BadRequestException(err.message));

				// remove file in temp
				unlinkSync(filePath);

				return resolve(
					cloudinaryHelper.getUploadResult({ ...file, files: [file.url] }),
				);
			});
		});
	}

	/**
	 * Upload video
	 *
	 * @param filePath
	 * @param options
	 * @returns
	 */
	private _uploadVideo(filePath: string, options?: UploadApiOptions): any {
		const uploadOptions = {
			...options,
			resource_type: "video",
			chunk_size: 6000000,
			eager: [
				{
					width: 300,
					height: 300,
					crop: "pad",
					auto_codec: "none",
				},
				{
					width: 160,
					height: 100,
					crop: "crop",
					gravity: "south",
					auto_codec: "none",
				},
			],
		};

		return new Promise((resolve, reject) => {
			v2.uploader.upload(
				filePath,
				<UploadApiOptions>uploadOptions,
				(err, file) => {
					if (err) return reject(new BadRequestException(err.message));

					// remove file in temp
					unlinkSync(filePath);

					return resolve(
						cloudinaryHelper.getUploadResult({ ...file, files: [file.url] }),
					);
				},
			);
		});
	}
}
