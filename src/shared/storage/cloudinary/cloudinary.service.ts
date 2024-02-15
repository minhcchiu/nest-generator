import { UploadApiResponse, v2 } from "cloudinary";
import { CustomLogger } from "~shared/logger/logger.service";
import { FileType } from "~utils/types/file.type";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig, appConfigName } from "~config/environment/app.config";
import {
	CloudinaryConfig,
	cloudinaryConfigName,
} from "~config/environment/cloudinary.config";
import { removeFileExtension } from "~utils/file.util";

@Injectable()
export class CloudinaryService {
	private cloudinaryConfig: CloudinaryConfig;
	private appConfig: AppConfig;

	constructor(
		readonly configService: ConfigService,
		private readonly logger: CustomLogger,
	) {
		this.cloudinaryConfig =
			this.configService.get<CloudinaryConfig>(cloudinaryConfigName);
		this.appConfig = this.configService.get<AppConfig>(appConfigName);

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
		let fileName = file.fileName;

		// remove file extension
		if (file.fileType !== "raw") {
			fileName = removeFileExtension(fileName);
		}

		return new Promise((resolve, reject) => {
			try {
				v2.uploader
					.upload_stream(
						{
							resource_type: file.fileType,
							folder: file.fileFolder,
							public_id: fileName,
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

	async deleteByResourceId(input: { publicId: string; fileType: FileType }) {
		try {
			return v2.uploader.destroy(input.publicId, {
				resource_type: input.fileType,
			});
		} catch (error) {
			this.logger.warn(CloudinaryService.name, error);
		}
	}

	async deleteByResourceIds(
		inputs: {
			publicId: string;
			fileType: FileType;
		}[],
	) {
		try {
			return Promise.all(inputs.map((input) => this.deleteByResourceId(input)));
		} catch (error) {
			this.logger.warn(CloudinaryService.name, error);
		}
	}
}
