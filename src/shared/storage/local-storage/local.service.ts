import { Injectable } from "@nestjs/common";
import { rmSync, writeFileSync } from "fs";
import sizeOf from "image-size";
import { ResizeOptions } from "sharp";
import { EnvStatic } from "src/configurations/static.env";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { UploadedResult } from "~modules/pre-built/7-uploads/types/upload.result.type";
import { compressImage } from "~utils/files/file.helper";
import { genResizeImageName } from "~utils/files/file.util";
import { StorageService } from "../storage.service";

export type ImageSize = "XLarge" | "Large" | "Medium" | "Small" | "XSmall";
export const ImageSizeOptions: { width: number; name: ImageSize }[] = [
	{ width: 150, name: "XSmall" },
	{ width: 360, name: "Small" },
	{ width: 480, name: "Medium" },
	{ width: 720, name: "Large" },
	{ width: 1080, name: "XLarge" },
];

export const getResizeOptions = (buffer: Buffer, imageSizes: ImageSize[]) => {
	const imageDimensions = sizeOf(buffer);
	const sizeOptions = ImageSizeOptions.filter((option) =>
		imageSizes.includes(option.name),
	);

	const resizeOptions: ResizeOptions[] = [];
	const resizeNames: ImageSize[] = [];

	for (const option of sizeOptions) {
		resizeNames.push(option.name);

		if (imageDimensions.width > option.width) {
			resizeOptions.push({ width: option.width });
		}
	}

	return { resizeOptions, resizeNames };
};

@Injectable()
export class LocalService implements StorageService {
	private serverUrl: string;

	constructor() {
		this.serverUrl = EnvStatic.getAppConfig().serverUrl;
	}

	async saveFile(
		file: FileFormatted,
		imageSizes: ImageSize[] = [],
	): Promise<UploadedResult> {
		// path storage
		const fileOriginal = `${file.fileFolder}/${file.fileName}`;
		writeFileSync(`public/${fileOriginal}`, file.buffer);
		const url = `${this.serverUrl}/static/${fileOriginal}`;

		const resourceIds = [fileOriginal];

		// Handle image resize
		const resizeUrls: Record<string, string> = {};
		if (file.resourceType === ResourceTypeEnum.Image && imageSizes.length) {
			const { resizeOptions, resizeNames } = getResizeOptions(
				file.buffer,
				imageSizes,
			);

			const imagesResized = await this._resizeImages(file, resizeOptions);

			resizeNames.forEach((name, index) => {
				resizeUrls[`url${name}`] = imagesResized[index]?.url || url;

				// Add key to resource
				if (imagesResized[index]?.key)
					resourceIds.push(imagesResized[index].key);
			});
		}

		return {
			...resizeUrls,
			url,
			resourceIds,
			fileFolder: file.fileFolder,
			fileName: file.fileName,
			fileSize: file.size,
			fileType: file.mimetype,
			originalname: file.originalname,
			storageLocation: StorageLocationEnum.Local,
			resourceType: file.resourceType,
		};
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

		const imagesResized: { url: string; key: string }[] = [];

		resizeOptions.forEach((resizeOption, index) => {
			const imageName = genResizeImageName(file.fileName, resizeOption);
			const filePath = `${file.fileFolder}/${imageName}`;

			writeFileSync(`public/${filePath}`, imagesCompressed[index]);

			imagesResized.push({
				url: `${this.serverUrl}/static/${filePath}`,
				key: filePath,
			});
		});

		return imagesResized;
	}
}
