import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { genUniqueFilename, getFileExtension } from "~utils/files/file.util";

import { BadRequestException, Injectable } from "@nestjs/common";

import { StorageServerEnum } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/static.env";
import { EventEmitterService } from "~shared/event-emitters/event-emitter.service";
import {
	ImageSize,
	LocalService,
} from "~shared/storage/local-storage/local.service";
import { S3Service } from "~shared/storage/s3/s3.service";
import { ResourceTypeEnum } from "./enum/resource-type.enum";
import { FileFormatted } from "./types/file-formatted.type";
import { FileOption } from "./types/file-option.type";
import { UploadedError } from "./types/upload.error.type";
import { UploadedResult } from "./types/upload.result.type";

@Injectable()
export class UploadService {
	private fileFilter: Record<ResourceTypeEnum, FileOption> | object = {};
	private storageFolders: Record<ResourceTypeEnum, string> | object = {};
	private storageServer: StorageServerEnum;

	constructor(
		private readonly localService: LocalService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly s3Service: S3Service,
		private readonly eventEmitterService: EventEmitterService,
	) {
		// init storage
		this.init();
	}

	init() {
		this.storageServer = EnvStatic.getAppConfig().storageServer;
		const uploadConfig = EnvStatic.getUploadConfig();

		this.storageFolders = uploadConfig.storageFolders;
		this.fileFilter = {
			image: uploadConfig.image,
			video: uploadConfig.video,
			raw: uploadConfig.raw,
			audio: uploadConfig.audio,
			auto: uploadConfig.auto,
		};
	}

	async uploadFiles(fileInputs: Express.Multer.File[], userId: string) {
		const promiseSettled = await Promise.allSettled(
			fileInputs.map((fileInput) => this._saveFile(fileInput)),
		);

		const filesUploaded: {
			originalname: string;
			fileSize: number;
			url: string;
			urlXLarge?: string;
			urlLarge?: string;
			urlMedium?: string;
			urlSmall?: string;
			urlXSmall?: string;
			resourceType: ResourceTypeEnum;
		}[] = [];
		const filesFailed: UploadedError[] = [];
		const fileItems: UploadedResult[] = [];

		for (const uploaded of promiseSettled) {
			if (uploaded.status === "fulfilled") {
				filesUploaded.push({
					originalname: uploaded.value.originalname,
					fileSize: uploaded.value.fileSize,
					url: uploaded.value.url,
					urlXLarge: uploaded.value.urlXLarge,
					urlLarge: uploaded.value.urlLarge,
					urlMedium: uploaded.value.urlMedium,
					urlSmall: uploaded.value.urlSmall,
					urlXSmall: uploaded.value.urlXSmall,
					resourceType: uploaded.value.resourceType,
				});

				fileItems.push(uploaded.value);
			} else {
				console.log({ uploaded });
				filesFailed.push({
					originalname: uploaded.reason.response?.originalname,
					fileSize: uploaded.reason.response?.fileSize,
					error: uploaded.reason.response?.error,
				});
			}
		}

		this.eventEmitterService.emitFileUploaded(fileItems, userId);

		return {
			filesUploaded,
			filesFailed,
		};
	}

	async uploadFile(fileInput: Express.Multer.File, userId: string) {
		const fileSaved = await this._saveFile(fileInput);

		this.eventEmitterService.emitFileUploaded([fileSaved], userId);

		return fileSaved;
	}

	async _saveFile(fileInput: Express.Multer.File): Promise<UploadedResult> {
		try {
			// validate file
			const fileFormatted = this._validateFile(fileInput);
			const imageSizes: ImageSize[] = [
				"XLarge",
				"Large",
				"Medium",
				"Small",
				"XSmall",
			];

			switch (this.storageServer) {
				case StorageServerEnum.S3:
					return this.s3Service.saveFile(fileFormatted, imageSizes);

				case StorageServerEnum.Cloudinary:
					return this.cloudinaryService.saveFile(fileFormatted, imageSizes);

				case StorageServerEnum.Local:
					return this.localService.saveFile(fileFormatted, imageSizes);

				default:
					throw new BadRequestException("Storage server not found");
			}
		} catch (error) {
			throw new BadRequestException({
				error: error?.message || "Something went wrong",
				originalname: fileInput.originalname,
				fileSize: fileInput.size,
			});
		}
	}

	private _validateFile(file: Express.Multer.File): FileFormatted {
		const fileExt = getFileExtension(file.originalname);
		const resourceType = this._getResourceType(fileExt);

		const { maxSize, allowedExtensions } = this.fileFilter[resourceType];
		const fileSizeInMB = file.size / (1024 * 1024);

		if (fileSizeInMB > maxSize || !allowedExtensions.includes(fileExt)) {
			throw new BadRequestException(
				`Invalid file. Maximum size: ${maxSize / (1024 * 1024)}MB, allowed extensions: ${allowedExtensions.join(", ")}`,
			);
		}

		const fileFolder = this.storageFolders[resourceType];
		const fileName = genUniqueFilename(file.originalname);

		return {
			mimetype: file.mimetype,
			buffer: file.buffer,
			size: file.size,
			resourceType,
			fileFolder,
			fileExt,
			fileName,
			originalname: file.originalname,
		};
	}

	private _getResourceType(fileExt: string): ResourceTypeEnum {
		const fileType = Object.keys(this.fileFilter).find((key) => {
			return this.fileFilter[key].allowedExtensions.includes(fileExt);
		});

		if (!fileType) throw new BadRequestException("Unsupported file type");

		return <ResourceTypeEnum>fileType;
	}
}
