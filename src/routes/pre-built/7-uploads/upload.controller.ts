import { ApiUploadFiles } from "src/common/swaggers/api-upload-files.swagger";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";

import {
	Controller,
	Post,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { CreateUserFileDto } from "../7-user-files/dto/create-user-file.dto";
import { UserFileService } from "../7-user-files/user-file.service";
import { ResponseUploadedDto } from "./dto/response-uploaded.dto";
import { UploadService } from "./upload.service";

@ApiTags("uploads")
@Controller("uploads")
export class UploadController {
	constructor(
		private readonly uploadService: UploadService,
		private readonly userFileService: UserFileService,
	) {}

	@ApiBearerAuth()
	@ApiConsumes("multipart/form-data")
	@ApiOperation({ summary: "Upload files" })
	@ApiUploadFiles(["files"])
	@Post("cloudinary")
	@UseInterceptors(FilesInterceptor("files", 10))
	async uploadFilesToCloudinary(
		@GetCurrentUserId() userId: string,
		@UploadedFiles()
		inputs: Array<Express.Multer.File>,
	) {
		// upload files
		const filesUploaded = await Promise.all(
			inputs.map((file) => this.uploadService.uploadToCloudinary(file)),
		);

		const results: ResponseUploadedDto[] = [];
		const fileItems: CreateUserFileDto[] = [];

		// add result
		filesUploaded.forEach((file) => {
			// uploaded success
			if (file.url) {
				results.push({
					fileName: file.fileName,
					originalname: file.originalname,
					fileSize: file.fileSize,
					url: file.url,
				});

				// add file item
				fileItems.push({
					fileFolder: file.fileFolder,
					fileName: file.fileName,
					fileSize: file.fileSize,
					fileType: file.fileType,
					resourceId: file.resourceId,
					storageLocation: file.storageLocation,
					uploadedAt: file.uploadedAt,
					url: file.url,
					userId,
				});
			} else {
				// upload failed
				results.push(file);
			}
		});

		// save files
		this.userFileService.createMany(fileItems).catch();

		return results;
	}

	@ApiBearerAuth()
	@ApiConsumes("multipart/form-data")
	@ApiOperation({ summary: "Upload files" })
	@ApiUploadFiles(["files"])
	@Post("s3")
	@UseInterceptors(FilesInterceptor("files", 10))
	async uploadFilesToS3(
		@GetCurrentUserId() userId: string,
		@UploadedFiles()
		inputs: Array<Express.Multer.File>,
	) {
		// upload files
		const filesUploaded = await Promise.all(
			inputs.map((file) => this.uploadService.uploadToS3(file)),
		);

		const results: ResponseUploadedDto[] = [];
		const fileItems: CreateUserFileDto[] = [];

		// add result
		filesUploaded.forEach((file) => {
			// uploaded success
			if (file.url) {
				results.push({
					fileName: file.fileName,
					originalname: file.originalname,
					fileSize: file.fileSize,
					url: file.url,
				});

				// add file item
				fileItems.push({
					fileFolder: file.fileFolder,
					fileName: file.fileName,
					fileSize: file.fileSize,
					fileType: file.fileType,
					resourceId: file.resourceId,
					storageLocation: file.storageLocation,
					uploadedAt: file.uploadedAt,
					url: file.url,
					userId,
				});
			} else {
				// upload failed
				results.push(file);
			}
		});

		// save files
		this.userFileService.createMany(fileItems).catch();

		return results;
	}
}
