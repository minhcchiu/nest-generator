import {
	AppConfig,
	ConfigName,
	FileOption,
	UploadConfig,
} from "~config/environment";
import { getFileExtension } from "~helpers/storage.helper";
import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { generateFileName } from "~utils/file.util";
import { FileType } from "~utils/types/file.type";

import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { StorageLocationEnum } from "./enum/store-location.enum";
import { S3Service } from "~shared/storage/s3/s3.service";

@Injectable()
export class UploadService {
	private fileFilter: Record<FileType, FileOption> | object = {};
	private storageFolders: Record<FileType, string> | object = {};
	private appName = "";

	constructor(
		private readonly cloudinaryService: CloudinaryService,
		private readonly s3Service: S3Service,
		private readonly configService: ConfigService,
	) {
		const uploadConfig = configService.get<UploadConfig>(ConfigName.upload);

		this.fileFilter = {
			auto: uploadConfig.auto,
			video: uploadConfig.video,
			image: uploadConfig.image,
			raw: uploadConfig.raw,
		};
		this.storageFolders = uploadConfig.storageFolders;
		this.appName = this.configService.get<AppConfig>(ConfigName.app).appName;
	}

	async uploadToCloudinary(file: Express.Multer.File) {
		try {
			const { fileType, fileFolder, fileName, fileExt } =
				this._validateFile(file);

			const res = await this.cloudinaryService.uploadStream({
				fileType,
				fileFolder,
				fileName: fileType === "raw" ? `${fileName}.${fileExt}` : fileName,
				buffer: file.buffer,
			});

			return {
				url: res.url,
				fileFolder: res.folder,
				fileSize: res.bytes,
				resourceId: res.public_id,

				fileName: fileName,
				fileType: fileType,
				storageLocation: StorageLocationEnum.Cloudinary,
				originalname: file.originalname,
				uploadedAt: Date.now(),
			};
		} catch (error) {
			return {
				error: error.message,

				fileName: file.originalname,
				originalname: file.originalname,
				fileSize: file.size,
			};
		}
	}

	async uploadToS3(file: Express.Multer.File) {
		try {
			const { fileName, fileType, fileExt } = this._validateFile(file);

			const res = await this.s3Service.upload({
				mimetype: file.mimetype,
				body: file.buffer,
				fileName: `${fileName}.${fileExt}`,
			});

			return {
				url: res.Location,
				fileFolder: res.Bucket,
				resourceId: res.Key,

				fileName: fileName,
				fileType: fileType,
				fileSize: file.size,
				storageLocation: StorageLocationEnum.S3,
				originalname: file.originalname,
				uploadedAt: Date.now(),
			};
		} catch (error) {
			return {
				error: error.message,

				fileName: file.originalname,
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
			fileFolder: `${this.appName}/${fileFolder}`,
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
