import { getFileExtension } from "~helpers/storage.helper";
import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { generateFileName } from "~utils/file.util";
import { FileType } from "~utils/types/file.type";

import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { StorageLocationEnum } from "./enum/store-location.enum";
import { S3Service } from "~shared/storage/s3/s3.service";
import { UploadedResult } from "./types/upload.result.type";
import { UploadedError } from "./types/upload.error.type";
import {
	FileOption,
	UploadConfig,
	uploadConfigName,
} from "~config/environment/upload.config";
import { AppConfig, appConfigName } from "~config/environment/app.config";

@Injectable()
export class UploadService {
	private fileFilter: Record<FileType, FileOption> | object = {};
	private storageFolders: Record<FileType, string> | object = {};
	private appConfig: AppConfig;
	private uploadConfig: UploadConfig;

	constructor(
		private readonly cloudinaryService: CloudinaryService,
		private readonly s3Service: S3Service,
		private readonly configService: ConfigService,
	) {
		this.uploadConfig = configService.get<UploadConfig>(uploadConfigName);
		this.appConfig = this.configService.get<AppConfig>(appConfigName);

		// init storage
		this.storageFolders = this.uploadConfig.storageFolders;
		this.fileFilter = {
			auto: this.uploadConfig.auto,
			video: this.uploadConfig.video,
			image: this.uploadConfig.image,
			raw: this.uploadConfig.raw,
		};
	}

	async uploadFile(
		file: Express.Multer.File,
	): Promise<UploadedResult | UploadedError> {
		switch (this.appConfig.storageServer) {
			case "S3":
				return this._uploadToS3(file);

			case "CLOUDINARY":
				return this._uploadToCloudinary(file);

			case "LOCAL":
				return {
					error: "Local storage is not implemented yet",
					originalname: file.originalname,
					fileSize: file.size,
				};

			default:
				throw new BadRequestException("Storage server not found");
		}
	}

	private async _uploadToCloudinary(
		file: Express.Multer.File,
	): Promise<UploadedResult | UploadedError> {
		try {
			// validate file
			const validFile = this._validateFile(file);

			// generate file name
			let fileName = `${validFile.fileName}.${validFile.fileExt}`;
			if (validFile.fileType === "raw") fileName = validFile.fileName;

			// upload file to cloudinary
			const res = await this.cloudinaryService.uploadStream({
				fileType: validFile.fileType,
				fileFolder: validFile.fileFolder,
				fileName,
				buffer: validFile.file.buffer,
			});

			// return result
			return {
				url: res.url,
				fileFolder: res.folder,
				fileSize: res.bytes,
				resourceId: res.public_id,

				fileName: `${validFile.fileName}.${validFile.fileExt}`,
				fileType: validFile.fileType,
				originalname: validFile.file.originalname,
				storageLocation: StorageLocationEnum.Cloudinary,
				uploadedAt: Date.now(),
			};
		} catch (error) {
			// return error
			return {
				error: error?.message || "Cloudinary upload failed",
				originalname: file.originalname,
				fileSize: file.size,
			};
		}
	}

	private async _uploadToS3(
		file: Express.Multer.File,
	): Promise<UploadedResult | UploadedError> {
		try {
			// validate file
			const validFile = this._validateFile(file);

			// generate file name
			const fileName = `${validFile.fileName}.${validFile.fileExt}`;

			// upload file to S3
			const res = await this.s3Service.upload({
				buffer: validFile.file.buffer,
				fileName,
				fileFolder: validFile.fileFolder,
			});

			// return result
			return {
				url: res.Location,
				resourceId: res.Key,
				fileFolder: validFile.fileFolder,

				fileName,
				fileType: validFile.fileType,
				fileSize: validFile.file.size,
				originalname: validFile.file.originalname,
				storageLocation: StorageLocationEnum.S3,
				uploadedAt: Date.now(),
			};
		} catch (error) {
			// return error
			return {
				error: error?.message || "S3 upload failed",
				originalname: file.originalname,
				fileSize: file.size,
			};
		}
	}

	_validateFile(file: Express.Multer.File) {
		const fileExt = getFileExtension(file.originalname);
		const fileType = this._getFileType(fileExt);

		const { maxSize, allowedExtensions } = this.fileFilter[fileType];
		const fileSizeInMB = file.size / (1024 * 1024);

		if (fileSizeInMB > maxSize || !allowedExtensions.includes(fileExt)) {
			throw new BadRequestException(
				`Invalid file. Maximum size: ${maxSize}MB, allowed extensions: ${allowedExtensions.join(
					", ",
				)}`,
			);
		}

		const fileFolder = this.storageFolders[fileType];
		const fileName = generateFileName(file.originalname);

		return {
			fileType,
			file,
			fileFolder: `${this.appConfig.appName}/${fileFolder}`,
			fileExt,
			fileName,
		};
	}

	_getFileType(fileExt: string): FileType {
		const fileType = Object.keys(this.fileFilter).find((key) => {
			return this.fileFilter[key].allowedExtensions.includes(fileExt);
		});

		if (!fileType) throw new BadRequestException("Unsupported file type");

		return <FileType>fileType;
	}
}
