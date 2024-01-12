import { UploadApiOptions, v2 } from "cloudinary";
import { unlinkSync } from "fs";
import { ResourceTypeEnum } from "~routes/1-upload/enum/resource-type.enum";
import { Logger } from "~shared/logger/logger.service";
import { getFileName } from "~utils/file.util";

import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { cloudinaryHelper } from "./cloudinary.helper";
import { CloudinaryConfig } from "~config/interfaces/config.interface";
import { ConfigName } from "~config/enums/config.enum";

@Injectable()
export class CloudinaryService {
	private readonly cloudinaryConfig: CloudinaryConfig;

	private uploadOptions = {
		[ResourceTypeEnum.IMAGE]: this._uploadImage,
		[ResourceTypeEnum.FILE]: this._uploadFile,
		[ResourceTypeEnum.AUDIO]: this._uploadAudio,
		[ResourceTypeEnum.VIDEO]: this._uploadVideo,
	};

	constructor(
		readonly configService: ConfigService,
		private readonly logger: Logger,
	) {
		this.cloudinaryConfig = configService.get<CloudinaryConfig>(
			ConfigName.Cloudinary,
		);
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
	 * @param resourceIds
	 * @returns
	 */
	deleteByResourceIds(resourceIds: string[]) {
		return v2.api.delete_resources(resourceIds);
	}

	/**
	 * Delete one
	 *
	 * @param resourceId
	 * @returns
	 */
	async deleteByResourceId(resourceId: string) {
		try {
			return await v2.uploader.destroy(resourceId);
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
	 * Upload audio
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
					audio_codec: "none",
				},
				{
					width: 160,
					height: 100,
					crop: "crop",
					gravity: "south",
					audio_codec: "none",
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
