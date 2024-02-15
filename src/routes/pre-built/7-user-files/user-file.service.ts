import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateUserFileDto } from "./dto/create-user-file.dto";
import { UserFile, UserFileDocument } from "./schemas/user-file.schema";
import { LocalService } from "~shared/storage/local-storage/local.service";
import { StorageLocationEnum } from "../7-uploads/enum/store-location.enum";
import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { S3Service } from "~shared/storage/s3/s3.service";
import { FileType } from "~utils/types/file.type";

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

	async createMany(inputs: CreateUserFileDto[]) {
		return this.userFileModel.create(inputs);
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
				return this.localService.deleteByResourceId(file.resourceId);

			case StorageLocationEnum.S3:
				return this.s3Service.deleteByResourceId(file.resourceId);

			case StorageLocationEnum.Cloudinary:
				return this.cloudinaryService.deleteByResourceId({
					publicId: file.resourceId,
					fileType: file.fileType,
				});

			default:
				throw new BadRequestException("Invalid storage location");
		}
	}

	async deleteByUrls(urls: string[]) {
		const files = await this.findAll({ url: { $in: urls } });

		const resourceIdsLocal: string[] = [];
		const resourceIdsS3: string[] = [];
		const resourceIdsCloudinary: { publicId: string; fileType: FileType }[] =
			[];

		files.forEach((file) => {
			switch (file.storageLocation) {
				case StorageLocationEnum.Local:
					resourceIdsLocal.push(file.resourceId);
					break;

				case StorageLocationEnum.S3:
					resourceIdsS3.push(file.resourceId);
					break;

				case StorageLocationEnum.Cloudinary:
					resourceIdsCloudinary.push({
						publicId: file.resourceId,
						fileType: file.fileType,
					});
					break;
			}
		});

		await Promise.allSettled([
			this.localService.deleteByResourceIds(resourceIdsLocal),
			this.cloudinaryService.deleteByResourceIds(resourceIdsCloudinary),
			this.s3Service.deleteByResourceIds(resourceIdsS3),
		]);

		return this.deleteMany({ url: { $in: urls } });
	}
}
