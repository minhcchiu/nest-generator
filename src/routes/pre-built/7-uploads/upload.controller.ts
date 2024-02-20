import { ApiUploadFiles } from "src/common/swaggers/api-upload-files.swagger";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";

import {
	Controller,
	HttpCode,
	HttpStatus,
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
import { UploadedResult } from "./types/upload.result.type";
import { UploadedError } from "./types/upload.error.type";

@ApiTags("Uploads")
@Controller("uploads")
export class UploadController {
	constructor(
		private readonly uploadService: UploadService,
		private readonly userFileService: UserFileService,
	) {}

	// @ApiBearerAuth()
	// @ApiConsumes("multipart/form-data")
	// @ApiOperation({ summary: "Upload files" })
	// @ApiUploadFiles(["files"])
	// @Post("cloudinary")
	// @UseInterceptors(FilesInterceptor("files", 10))
	// async uploadFilesToCloudinary(
	// 	@GetCurrentUserId() userId: string,
	// 	@UploadedFiles()
	// 	inputs: Array<Express.Multer.File>,
	// ) {
	// 	// upload files
	// 	const filesUploaded = await Promise.all(
	// 		inputs.map((file) => this.uploadService.uploadToCloudinary(file)),
	// 	);

	// 	// handle upload results
	// 	const { fileItems, results } = this._handleUploadResults(
	// 		filesUploaded,
	// 		userId,
	// 	);

	// 	// save files
	// 	this.userFileService.createMany(fileItems).catch();

	// 	// return results
	// 	return results;
	// }

	// @ApiBearerAuth()
	// @ApiConsumes("multipart/form-data")
	// @ApiOperation({ summary: "Upload files" })
	// @ApiUploadFiles(["files"])
	// @Post("s3")
	// @UseInterceptors(FilesInterceptor("files", 10))
	// async uploadFilesToS3(
	// 	@GetCurrentUserId() userId: string,
	// 	@UploadedFiles()
	// 	inputs: Array<Express.Multer.File>,
	// ) {
	// 	// upload files
	// 	const filesUploaded = await Promise.all(
	// 		inputs.map((file) => this.uploadService.uploadToS3(file)),
	// 	);

	// 	// handle upload results
	// 	const { fileItems, results } = this._handleUploadResults(
	// 		filesUploaded,
	// 		userId,
	// 	);

	// 	// save files
	// 	this.userFileService.createMany(fileItems).catch();

	// 	// return results
	// 	return results;
	// }

	@ApiBearerAuth()
	@ApiConsumes("multipart/form-data")
	@ApiOperation({ summary: "Upload files" })
	@ApiUploadFiles(["files"])
	@Post()
	@UseInterceptors(FilesInterceptor("files", 10))
	@HttpCode(HttpStatus.CREATED)
	async uploadFiles(
		@GetCurrentUserId() userId: string,
		@UploadedFiles()
		inputs: Array<Express.Multer.File>,
	) {
		// upload files
		const filesUploaded = await Promise.all(
			inputs.map((file) => this.uploadService.uploadFile(file)),
		);

		// handle upload results
		const { fileItems, results } = this._handleUploadResults(
			filesUploaded,
			userId,
		);

		// save files
		this.userFileService.createMany(fileItems).catch();

		return results;
	}

	// Handle the results of file uploads
	private _handleUploadResults(
		filesUploaded: (UploadedResult | UploadedError)[],
		userId: string,
	) {
		const results: ResponseUploadedDto[] = [];
		const fileItems: CreateUserFileDto[] = [];

		// Iterate through the filesUploaded array
		filesUploaded.forEach((file) => {
			// Check if there was an error during upload
			if (file?.error) {
				results.push(file);
			} else {
				const res = file as UploadedResult;

				// Add the uploaded file to the results array
				results.push({
					originalname: res.originalname,
					fileSize: res.fileSize,
					url: res.url,
				});

				// Add the uploaded file to the fileItems array
				fileItems.push({ ...res, userId });
			}
		});

		return { results, fileItems };
	}
}
