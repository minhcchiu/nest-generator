import { close, open, read, renameSync, statSync } from "fs";
import { filetypemime } from "magic-bytes.js";
import { join } from "path";
import { ResourceTypeEnum } from "~pre-built/7-uploads/enum/resource-type.enum";
import { StorageDirEnum } from "~pre-built/7-uploads/enum/storage-dir.enum";

export const getFileName = (filePath: string) => {
	const lastIndexOfSlash = filePath.lastIndexOf("-");
	const dateTimeLength = 13;

	const fileName = filePath.slice(lastIndexOfSlash - dateTimeLength);

	return fileName;
};

export const localStorageHelper = {
	publicDir: join(process.cwd(), "public"),

	/**
	 * Upload file
	 *
	 * @param filePath
	 * @param uploadDir
	 * @returns
	 */
	async upload(
		filePath: string,
		uploadDir: StorageDirEnum,
		resourceType: ResourceTypeEnum,
	) {
		const size = statSync(filePath).size || 0;
		const filemime = await this.getTypeUploadTypemime(filePath);
		const type = filemime || `${resourceType}/${getFileName(filePath)}`;
		const file = await this.moveFileToDiskStorage(
			filePath,
			uploadDir.split("/")[2],
		);

		return {
			type,
			files: [getFileName(file)],
			size,
			folder: uploadDir,
			secureUrl: file,
			resourceID: file,
			// storage: StorageServiceEnum.LOCAL_DISK,
		};
	},

	/**
	 * Upload Image
	 *
	 * @param filePath
	 * @param uploadDir
	 * @returns
	 */
	async uploadImage(
		filePath: string,
		uploadDir: StorageDirEnum,
		resourceType: ResourceTypeEnum = ResourceTypeEnum.IMAGE,
	) {
		const size = statSync(filePath).size || 0;
		const filemime = await this.getTypeUploadTypemime(filePath);
		const imageType = filemime.split("/")[1];
		const files = await this.compressImage(filePath, imageType);
		const type = filemime || `${resourceType}/${getFileName(filePath)}`;

		return {
			type,
			files,
			size,
			folder: uploadDir,
			// storage: StorageServiceEnum.LOCAL_DISK,
		};
	},

	/**
	 * Get type file need resize
	 *
	 * @param filePath
	 * @returns
	 */
	async getTypeUploadTypemime(filePath: string) {
		const maxLength = 4100;

		const buffer = await this.getBufferFromFile(filePath, maxLength);

		const result = filetypemime(buffer);

		// check typemine
		const isValidTypemine = result && result[0] !== null;

		if (isValidTypemine) return result[0];

		return null;
	},

	/**
	 * Get buffer from file
	 *
	 * @param filePath
	 * @param maxLength
	 * @returns
	 */
	async getBufferFromFile(filePath: string, maxLength: number): Promise<any[]> {
		return new Promise((resolve, reject) => {
			// Open file
			open(filePath, "r", (error, fd) => {
				if (error) return reject(error);

				const buffer = Buffer.alloc(maxLength);

				// Read file data
				read(fd, buffer, 0, maxLength, 0, (err) => {
					if (err) return reject(err);

					const result = (<any>buffer) as any[];

					close(fd, () => resolve(result));
				});
			});
		});
	},

	/**
	 * Compress image
	 *
	 * @param filePath
	 * @param imageType
	 * @returns
	 */
	async compressImage(filePath: string, imageType: string): Promise<any[]> {
		// image type = jpg|jpeg
		if (imageType === "jpg" || imageType === "jpeg")
			return this.compressJPG(filePath);

		// image type = png
		if (imageType === "png") return this.compressPNG(filePath);

		if (imageType === "gif") return this.compressGIF(filePath);

		return [];
	},

	/**
	 * Movie file from temp to uploadFiles
	 *
	 * @param filePath
	 * @returns
	 */
	async moveFileToDiskStorage(filePath: string, newFolder: StorageDirEnum) {
		const newPath = filePath.replace("tmp", newFolder);

		// move file
		renameSync(filePath, newPath);

		return newPath;
	},

	/**
	 * Generate file name resize
	 *
	 * @param filePath
	 * @param keyName
	 * @returns
	 */
	genUniqueFilenameResize(filePath: string, keyName: string) {
		const fileName = getFileName(filePath);

		const fileExt = fileName.split(".").pop();
		const originname = fileName.slice(0, -fileExt.length - 1);

		return `${originname}_${keyName}.${fileExt}`;
	},
};
