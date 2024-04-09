import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { UploadType } from "~types/upload-type";
import { genUniqueFilename, getFileExtension } from "~utils/files/file.util";

import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
	AppConfig,
	StorageServerEnum,
} from "src/configurations/app-config.type";
import { appConfigName } from "src/configurations/app.config";
import { LocalService } from "~shared/storage/local-storage/local.service";
import { S3Service } from "~shared/storage/s3/s3.service";
import { FileOption, UploadConfig } from "./config/upload-config.type";
import { uploadConfigName } from "./config/upload.config";
import { FileFormatted } from "./types/file-formatted.type";
import { UploadedError } from "./types/upload.error.type";
import { UploadedResult } from "./types/upload.result.type";

@Injectable()
export class UploadService {
	private fileFilter: Record<UploadType, FileOption> | object = {};
	private storageFolders: Record<UploadType, string> | object = {};
	private appConfig: AppConfig;
	private uploadConfig: UploadConfig;

	constructor(
		private readonly configService: ConfigService,
		private readonly localService: LocalService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly s3Service: S3Service,
	) {
		this.uploadConfig = configService.get<UploadConfig>(uploadConfigName);
		this.appConfig = this.configService.get<AppConfig>(appConfigName);

		// init storage
		this.storageFolders = this.uploadConfig.storageFolders;
		this.fileFilter = {
			image: this.uploadConfig.image,
			video: this.uploadConfig.video,
			raw: this.uploadConfig.raw,
			audio: this.uploadConfig.audio,
			auto: this.uploadConfig.auto,
		};
	}

	async uploadFile(
		fileInput: Express.Multer.File,
	): Promise<UploadedResult | UploadedError> {
		// validate file
		const fileFormatted = this._getFormatFileInput(fileInput);

		switch (this.appConfig.storageServer) {
			// case StorageServerEnum.S3:
			// 	return this._uploadToS3(fileFormatted);

			// case StorageServerEnum.Cloudinary:
			// 	return this._uploadToCloudinary(fileFormatted);

			case StorageServerEnum.Local:
				return this.localService.upload(fileFormatted);

			default:
				throw new BadRequestException("Storage server not found");
		}
	}

	// private async _uploadToCloudinary(
	// 	fileInput: Express.Multer.File,
	// ): Promise<UploadedResult | UploadedError> {
	// 	try {
	// 		// validate file
	// 		const { file, fileFolder, fileName, fileType } =
	// 			this._getFormatFileInput(fileInput);

	// 		// upload file to cloudinary
	// 		const res = await this.cloudinaryService.uploadStream({
	// 			fileType,
	// 			fileFolder,
	// 			fileName,
	// 			buffer: file.buffer,
	// 		});

	// 		const { fileLg, fileMd, fileSm, fileXs } =
	// 			this.cloudinaryService.genImagesResize(res.public_id);

	// 		return {
	// 			url: res.url,
	// 			fileOriginal: res.url,
	// 			fileLg,
	// 			fileMd,
	// 			fileSm,
	// 			fileXs,
	// 			fileFolder: res.folder,
	// 			fileSize: res.bytes,
	// 			resourceId: res.public_id,

	// 			fileName,
	// 			fileType,
	// 			originalname: file.originalname,
	// 			storageLocation: StorageLocationEnum.Cloudinary,
	// 			uploadedAt: Date.now(),
	// 		};
	// 	} catch (error) {
	// 		return {
	// 			error: error?.message || "Cloudinary upload failed",
	// 			originalname: fileInput.originalname,
	// 			fileSize: fileInput.size,
	// 		};
	// 	}
	// }

	// private async _uploadToS3(
	// 	fileInput: Express.Multer.File,
	// ): Promise<UploadedResult | UploadedError> {
	// 	try {
	// 		// validate file
	// 		const { file, fileFolder, fileName, fileType } =
	// 			this._getFormatFileInput(fileInput);

	// 		// upload file to S3
	// 		const res = await this.s3Service.upload({
	// 			buffer: file.buffer,
	// 			fileName,
	// 			fileFolder: fileFolder,
	// 		});

	// 		return {
	// 			url: res.Location,
	// 			resourceId: res.Key,
	// 			fileFolder: fileFolder,

	// 			fileName,
	// 			fileType,
	// 			fileSize: file.size,
	// 			originalname: file.originalname,
	// 			storageLocation: StorageLocationEnum.S3,
	// 			uploadedAt: Date.now(),
	// 		};
	// 	} catch (error) {
	// 		return {
	// 			error: error?.message || "S3 upload failed",
	// 			originalname: fileInput.originalname,
	// 			fileSize: fileInput.size,
	// 		};
	// 	}
	// }

	_getFormatFileInput(file: Express.Multer.File): FileFormatted {
		const fileExt = getFileExtension(file.originalname);
		const uploadType = this._getUploadType(fileExt);

		const { maxSize, allowedExtensions } = this.fileFilter[uploadType];
		const fileSizeInMB = file.size / (1024 * 1024);

		if (fileSizeInMB > maxSize || !allowedExtensions.includes(fileExt)) {
			throw new BadRequestException(
				`Invalid file. Maximum size: ${maxSize}MB, allowed extensions: ${allowedExtensions.join(
					", ",
				)}`,
			);
		}

		const fileFolder = this.storageFolders[uploadType];
		const fileName = genUniqueFilename(file.originalname);

		return {
			mimetype: file.mimetype,
			buffer: file.buffer,
			size: file.size,
			uploadType,
			fileFolder,
			fileExt,
			fileName,
			originalname: file.originalname,
		};
	}

	_getUploadType(fileExt: string): UploadType {
		const fileType = Object.keys(this.fileFilter).find((key) => {
			return this.fileFilter[key].allowedExtensions.includes(fileExt);
		});

		if (!fileType) throw new BadRequestException("Unsupported file type");

		return <UploadType>fileType;
	}
}
