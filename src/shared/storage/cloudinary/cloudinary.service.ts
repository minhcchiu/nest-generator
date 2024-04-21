import { Injectable } from "@nestjs/common";
import { v2 } from "cloudinary";
import { ResizeOptions } from "sharp";
import { StorageServerEnum } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/static.env";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { UploadedResult } from "~modules/pre-built/7-uploads/types/upload.result.type";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { UploadType } from "~types/upload-type";
import { removeFileExtension } from "~utils/files/file.util";
import { ImageSize, getResizeOptions } from "../local-storage/local.service";
import { StorageService } from "../storage.service";

@Injectable()
export class CloudinaryService implements StorageService {
	constructor(private readonly logger: CustomLoggerService) {
		this.init();
	}

	init() {
		if (
			EnvStatic.getAppConfig().storageServer !== StorageServerEnum.Cloudinary
		) {
			this.logger.warn(
				"CloudinaryModule module was not init",
				CloudinaryService.name,
			);

			return;
		}

		v2.config(EnvStatic.getCloudinaryConfig().config);

		this.logger.log("CloudinaryModule init success", CloudinaryService.name);
	}

	async saveFile(
		file: FileFormatted,
		imageSizes?: ImageSize[],
	): Promise<UploadedResult> {
		const { url, key } = await this._uploadToCloudinary({
			buffer: file.buffer,
			fileFolder: file.fileFolder,
			fileName: file.fileName,
			resourceType: file.resourceType,
		});

		// handle image resize
		const resizeUrls: Record<string, string> = {};
		if (file.resourceType === ResourceTypeEnum.Image && imageSizes.length) {
			const { resizeOptions, resizeNames } = getResizeOptions(
				file.buffer,
				imageSizes,
			);

			const imagesResized = await this._resizeImages(key, resizeOptions);

			resizeNames.forEach((name, index) => {
				resizeUrls[`url${name}`] = imagesResized[index]?.url || url;
			});
		}

		return {
			...resizeUrls,
			url,
			resourceIds: [key],
			fileFolder: file.fileFolder,
			fileName: file.fileName,
			fileSize: file.size,
			fileType: file.mimetype,
			originalname: file.originalname,
			storageLocation: StorageLocationEnum.Cloudinary,
			resourceType: file.resourceType,
		};
	}
	delete(resourceId: string): Promise<{ deletedAt: number; message: string }> {
		console.log({ resourceId });
		throw new Error("Method not implemented.");
	}
	deleteMany(
		resourceIds: string[],
	): Promise<{ deletedAt: number; message: string }[]> {
		console.log({ resourceIds });
		throw new Error("Method not implemented.");
	}

	_uploadToCloudinary(file: {
		fileName: string;
		resourceType: ResourceTypeEnum;
		fileFolder: string;
		buffer: Buffer;
	}): Promise<{ url: string; key: string }> {
		// remove file extension
		if (file.resourceType !== ResourceTypeEnum.Raw) {
			file.fileName = removeFileExtension(file.fileName);
		}

		// check file type
		if (file.resourceType === ResourceTypeEnum.Audio) {
			file.resourceType = ResourceTypeEnum.Video;
		}

		return new Promise((resolve, reject) => {
			try {
				v2.uploader
					.upload_stream(
						{
							resource_type: <any>file.resourceType,
							folder: file.fileFolder,
							public_id: file.fileName,
						},
						(error, uploaded) => {
							if (error) return reject(error);

							return resolve({
								url: uploaded.url,
								key: uploaded.public_id,
							});
						},
					)
					.end(file.buffer);
			} catch (error) {
				reject(new Error(error));
			}
		});
	}

	genImagesResize(public_id: string) {
		return {
			fileXs: this._resizeImage(public_id, 150),
			fileSm: this._resizeImage(public_id, 360),
			fileMd: this._resizeImage(public_id, 480),
			fileLg: this._resizeImage(public_id, 1080),
		};
	}

	async deleteByResourceId(input: { publicId: string; fileType: UploadType }) {
		// check file type
		if (input.fileType === "audio") {
			input.fileType = "video";
		}

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
			fileType: UploadType;
		}[],
	) {
		try {
			return Promise.all(inputs.map((input) => this.deleteByResourceId(input)));
		} catch (error) {
			this.logger.warn(CloudinaryService.name, error);
		}
	}

	private async _resizeImages(
		key: string, // public_id
		resizeOptions: ResizeOptions[] = [],
	) {
		const imagesResizedUrls = resizeOptions.map((resizeOption) => {
			return this._resizeImage(key, resizeOption.width);
		});

		return imagesResizedUrls;
	}

	private _resizeImage(id: string, width: number) {
		const url = v2.url(id, {
			width,
			opacity: 80,
			crop: "fill",
		});

		return { url };
	}
}
