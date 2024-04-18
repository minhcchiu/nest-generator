import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { OnEvent } from "@nestjs/event-emitter";
import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { LocalService } from "~shared/storage/local-storage/local.service";
import { S3Service } from "~shared/storage/s3/s3.service";
import { StorageLocationEnum } from "../7-uploads/enum/store-location.enum";
import { UploadedResult } from "../7-uploads/types/upload.result.type";
import { UserFile, UserFileDocument } from "./schemas/user-file.schema";

@Injectable()
export class UserFileService extends BaseService<UserFileDocument> {
	@InjectModel(UserFile.name) userFileModel: PaginateModel<UserFileDocument>;
	constructor(
		@InjectModel(UserFile.name) model: PaginateModel<UserFileDocument>,
		private readonly localService: LocalService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly s3Service: S3Service,
	) {
		super(model);

		this.userFileModel = model;
	}

	@OnEvent("file.uploaded")
	handleFileUploadedEvent(files: UploadedResult[], userId: string) {
		console.log({ files, userId });
		throw new Error("Method not implemented.");
	}

	async deleteByUrl(url: string) {
		const file = await this.deleteOne({ url });

		if (!file) {
			return {
				message: "File not found",
				deletedAt: Date.now(),
			};
		}

		switch (file.storageLocation) {
			case StorageLocationEnum.Local:
			// return this.localService.delete(file.resourceId);

			case StorageLocationEnum.S3:
			// return this.s3Service.deleteByResourceId(file.resourceId);

			case StorageLocationEnum.Cloudinary:
			// return this.cloudinaryService.deleteByResourceId({
			// publicId: file.resourceId,
			// fileType: file.uploadType,
			// });

			// default:
			// throw new BadRequestException("Invalid storage location");
		}
	}

	async deleteByUrls(urls: string[]) {
		console.log({ urls });
		// // const files = await this.findMany({ url: { $in: urls } });
		// // const resourceIdsLocal: string[] = [];
		// // const resourceIdsS3: string[] = [];
		// // const resourceIdsCloudinary: { publicId: string; fileType: UploadType }[] =
		// // 	[];
		// // files.forEach((file) => {
		// // 	switch (file.storageLocation) {
		// // 		case StorageLocationEnum.Local:
		// // 			resourceIdsLocal.push(file.resourceId);
		// // 			break;
		// // 		case StorageLocationEnum.S3:
		// // 			resourceIdsS3.push(file.resourceId);
		// // 			break;
		// // 		case StorageLocationEnum.Cloudinary:
		// // 			resourceIdsCloudinary.push({
		// // 				publicId: file.resourceId,
		// // 				fileType: file.uploadType,
		// // 			});
		// // 			break;
		// // 	}
		// });
		// await Promise.allSettled([
		// 	this.localService.deleteMany(resourceIdsLocal),
		// 	this.cloudinaryService.deleteByResourceIds(resourceIdsCloudinary),
		// 	this.s3Service.deleteByResourceIds(resourceIdsS3),
		// ]);
		// return this.deleteMany({ url: { $in: urls } });
	}
}
