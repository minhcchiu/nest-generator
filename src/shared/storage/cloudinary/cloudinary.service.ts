import { UploadApiResponse, v2 } from "cloudinary";
import { AppConfig, CloudinaryConfig, ConfigName } from "~config/environment";
import { CustomLogger } from "~shared/logger/logger.service";
import { FileType } from "~utils/types/file.type";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudinaryService {
	private cloudinaryConfig: CloudinaryConfig;
	private appConfig: AppConfig;

	constructor(
		readonly configService: ConfigService,
		private readonly logger: CustomLogger,
	) {
		this.cloudinaryConfig = this.configService.get<CloudinaryConfig>(
			ConfigName.cloudinary,
		);
		this.appConfig = this.configService.get<AppConfig>(ConfigName.app);

		this.initCloudinary();
	}

	initCloudinary() {
		if (this.appConfig.storageServer === "CLOUDINARY") {
			v2.config(this.cloudinaryConfig.config);

			this.logger.log("CloudinaryModule init success", CloudinaryService.name);
		} else {
			this.logger.warn(
				"CloudinaryModule module was not init",
				CloudinaryService.name,
			);
		}
	}

	uploadStream(file: {
		fileName: string;
		fileType: FileType;
		fileFolder: string;
		buffer: Buffer;
	}): Promise<UploadApiResponse> {
		return new Promise((resolve, reject) => {
			try {
				v2.uploader
					.upload_stream(
						{
							resource_type: file.fileType,
							folder: file.fileFolder,
							public_id: file.fileName,
						},
						(error, uploadResult) => {
							if (error) return reject(error);

							return resolve(uploadResult);
						},
					)
					.end(file.buffer);
			} catch (error) {
				reject(new Error(error));
			}
		});
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
}
