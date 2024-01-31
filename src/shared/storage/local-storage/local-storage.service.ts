import { ResourceTypeEnum } from "~routes/pre-built/7-uploads/enum/resource-type.enum";
import { StorageDirEnum } from "~routes/pre-built/7-uploads/enum/storage-dir.enum";

import { Injectable } from "@nestjs/common";

import { localStorageHelper } from "./local-storage.helper";

@Injectable()
export class LocalStorageService {
	private uploadOptions = {
		[ResourceTypeEnum.IMAGE]: this._uploadImage,
		[ResourceTypeEnum.FILE]: this._uploadFile,
		[ResourceTypeEnum.AUTO]: this._uploadAudio,
		[ResourceTypeEnum.VIDEO]: this._uploadVideo,
	};

	/**
	 * Upload
	 *
	 * @param filePath
	 * @returns
	 */
	async upload(filePath: string, type: ResourceTypeEnum) {
		return this.uploadOptions[type](filePath);
	}

	/**
	 * Upload file/images
	 *
	 * @param filePath
	 * @returns
	 */
	private async _uploadFile(filePath: string) {
		const uploadDir = StorageDirEnum.Raws;

		return localStorageHelper.upload(
			filePath,
			uploadDir,
			ResourceTypeEnum.FILE,
		);
	}

	/**
	 * Upload file/images
	 *
	 * @param filePath
	 * @returns
	 */
	private async _uploadImage(filePath: string) {
		const uploadDir = StorageDirEnum.Images;

		return localStorageHelper.uploadImage(filePath, uploadDir);
	}

	/**
	 * Upload video
	 *
	 * @param filePath
	 * @returns
	 */
	private async _uploadVideo(filePath: string) {
		const uploadDir = StorageDirEnum.Videos;

		return localStorageHelper.upload(
			filePath,
			uploadDir,
			ResourceTypeEnum.VIDEO,
		);
	}

	/**
	 * Upload auto
	 *
	 * @param filePath
	 * @returns
	 */
	private async _uploadAudio(filePath: string) {
		const uploadDir = StorageDirEnum.Autos;

		return localStorageHelper.upload(
			filePath,
			uploadDir,
			ResourceTypeEnum.AUTO,
		);
	}
}
