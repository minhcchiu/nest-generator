import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { rmSync, writeFileSync } from "fs";
import { AppConfig } from "src/configurations/app-config.type";
import { appConfigName } from "src/configurations/app.config";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { compressImage } from "~utils/files/file.helper";
import { StorageService } from "../storage.service";

@Injectable()
export class LocalService implements StorageService {
	private serverUrl: string = "";

	constructor(private readonly configService: ConfigService) {
		this.serverUrl = this.configService.get<AppConfig>(appConfigName).serverUrl;
	}

	async upload(file: FileFormatted) {
		try {
			// path storage
			const resourceId = `${file.fileFolder}/${file.fileName}`;

			writeFileSync(resourceId, file.buffer);

			const imagesResized = {
				fileLg: `${this.serverUrl}/${resourceId}`,
				fileMd: `${this.serverUrl}/${resourceId}`,
				fileSm: `${this.serverUrl}/${resourceId}`,
				fileXs: `${this.serverUrl}/${resourceId}`,
			};
			if (file.uploadType === "image") {
				const { fileLg, fileMd, fileSm, fileXs } =
					await compressImage(resourceId);

				Object.assign(imagesResized, {
					fileLg: `${this.serverUrl}/${fileLg}`,
					fileMd: `${this.serverUrl}/${fileMd}`,
					fileSm: `${this.serverUrl}/${fileSm}`,
					fileXs: `${this.serverUrl}/${fileXs}`,
				});
			}

			return {
				fileOriginal: `${this.serverUrl}/${resourceId}`,
				fileFolder: file.fileFolder,
				fileName: file.fileName,
				fileSize: file.size,
				fileType: file.mimetype,
				originalname: file.originalname,
				resourceId,
				storageLocation: StorageLocationEnum.Local,
				uploadedAt: new Date().toISOString(),
				uploadType: file.uploadType,
				isUploadedSuccess: true,
				...imagesResized,
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
}
