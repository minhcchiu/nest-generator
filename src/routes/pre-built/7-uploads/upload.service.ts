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

@Injectable()
export class UploadService {
	private fileFilter: Record<FileType, FileOption> | object = {};
	private storageFolders: Record<FileType, string> | object = {};
	private appName = "";

	constructor(
		private readonly cloudinaryService: CloudinaryService,
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
			const { fileType, fileFolder, fileName } = this._validateFile(file);

			const res = await this.cloudinaryService.uploadImage(file, {
				fileType,
				fileFolder,
				fileName,
			});

			return {
				url: res.url,
				fileFolder: res.folder,
				fileName: fileName,
				fileSize: res.bytes,
				fileType: fileType,
				resourceId: res.public_id,
				storageLocation: StorageLocationEnum.Cloudinary,
				uploadedAt: Date.now(),
				originalname: file.originalname,
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
		const fileName = this._getFileName(file.originalname, fileType, fileExt);

		return {
			fileType,
			file,
			fileFolder: `${this.appName}/${fileFolder}`,
			fileExt,
			fileName,
		};
	}

	_getFileName(originalname: string, fileType: FileType, fileExt: string) {
		let fileName = generateFileName(originalname);

		if (fileType === "raw") {
			fileName = `${fileName}.${fileExt}`;
		}

		return fileName;
	}

	_getFileType(fileExt: string): FileType {
		const fileType = Object.keys(this.fileFilter).find((key) => {
			return this.fileFilter[key].allowedExtensions.includes(fileExt);
		});

		if (!fileType) throw new BadRequestException("Unsupported file type");

		return <FileType>fileType;
	}
}
