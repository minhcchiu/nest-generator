import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { rmSync, writeFileSync } from "fs";
import {
	AppConfig,
	appConfigName,
} from "~configuration/environment/app.config";
import { FileType } from "~types/file.type";

@Injectable()
export class LocalService {
	private appConfig: AppConfig;

	constructor(private readonly configService: ConfigService) {
		this.appConfig = this.configService.get<AppConfig>(appConfigName);
	}

	async upload(file: {
		fileName: string;
		fileType: FileType;
		fileFolder: string;
		buffer: Buffer;
	}) {
		// path storage
		const localFilePath = `${file.fileFolder}/${file.fileName}`;

		// upload file to local
		writeFileSync(localFilePath, file.buffer);

		return {
			url: `${this.appConfig.appUrl}/${localFilePath}`,
			folder: file.fileFolder,
			fileName: file.fileName,
			type: file.fileType,
			size: file.buffer.length,
			resourceId: localFilePath,
			uploadedAt: Date.now(),
		};
	}

	async deleteByResourceId(resourceId: string) {
		const localFilePath = `${process.cwd()}/${resourceId}`;

		rmSync(localFilePath);

		return {
			deletedAt: Date.now(),
			message: "File deleted successfully",
		};
	}

	async deleteByResourceIds(resourceIds: string[]) {
		return Promise.all(resourceIds.map(this.deleteByResourceId));
	}
}
