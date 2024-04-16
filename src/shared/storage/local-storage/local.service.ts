import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { rmSync, writeFileSync } from "fs";
import { ResizeOptions } from "sharp";
import { AppConfig } from "src/configurations/app-config.type";
import { appConfigName } from "src/configurations/app.config";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { compressImage } from "~utils/files/file.helper";
import { genResizeImageName } from "~utils/files/file.util";
import { StorageService } from "../storage.service";

@Injectable()
export class LocalService implements StorageService {
	private serverUrl: string = "";

	constructor(private readonly configService: ConfigService) {
		this.serverUrl = this.configService.get<AppConfig>(appConfigName).serverUrl;
	}

	async saveFile(
		file: FileFormatted,
		resizeOptions: ResizeOptions[] = [], // 150, 360, 480, 720
	) {
		try {
			// path storage

			const fileOriginal = `${file.fileFolder}/${file.fileName}`;
			writeFileSync(`public/${fileOriginal}`, file.buffer);

			const filesSaved = [fileOriginal];

			// write image resize
			if (file.uploadType === "image" && resizeOptions.length) {
				const imagesResized = await this._resizeImages(file, resizeOptions);

				filesSaved.push(...imagesResized);
			}

			return {
				files: filesSaved.map((file) => `${this.serverUrl}/static/${file}`),
				fileFolder: file.fileFolder,
				fileName: file.fileName,
				fileSize: file.size,
				fileType: file.mimetype,
				originalname: file.originalname,
				resourceId: filesSaved[0],
				storageLocation: StorageLocationEnum.Local,
				uploadedAt: new Date().toISOString(),
				uploadType: file.uploadType,
				isUploadedSuccess: true,
			};
		} catch (error) {
			return {
				error: error?.message || "Local upload failed",
				originalname: file.originalname,
				fileSize: file.size,
				isUploadedSuccess: false,
			};
		}
	}

	async delete(resourceId: string) {
		const localFilePath = `${process.cwd()}/${resourceId}`;

		rmSync(localFilePath);

		return {
			deletedAt: Date.now(),
			message: "File deleted successfully",
		};
	}

	async deleteMany(resourceIds: string[]) {
		return Promise.all(resourceIds.map(this.delete));
	}

	private async _resizeImages(
		file: FileFormatted,
		resizeOptions: ResizeOptions[] = [], // 150, 360, 480, 720
	) {
		const imagesCompressed = await compressImage(
			file.fileExt,
			file.buffer,
			resizeOptions,
		);

		const res: string[] = [];

		resizeOptions.forEach((resizeOption, index) => {
			const imageName = genResizeImageName(file.fileName, resizeOption);
			const filePath = `${file.fileFolder}/${imageName}`;

			writeFileSync(`public/${filePath}`, imagesCompressed[index]);
			res.push(filePath);
		});

		return res;
	}
}
