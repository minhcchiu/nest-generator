import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Types } from "mongoose";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { UploadDto } from "./dto/upload.dto";
import { UploadService } from "./upload.service";

@Controller("uploads")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post("files")
	@UseInterceptors(FilesInterceptor("files", 10))
	@HttpCode(HttpStatus.CREATED)
	async uploadFiles(
		@GetCurrentUserId() userId: Types.ObjectId,
		@Body() body: UploadDto,
		@UploadedFiles()
		inputs: Array<Express.Multer.File>,
	) {
		return this.uploadService.uploadFiles(inputs, userId, body.imageSizes);
	}

	@Post("file")
	@UseInterceptors(FileInterceptor("file"))
	@HttpCode(HttpStatus.CREATED)
	async uploadFile(
		@GetCurrentUserId() userId: Types.ObjectId,
		@Body() body: UploadDto,
		@UploadedFile()
		input: Express.Multer.File,
	) {
		return this.uploadService.uploadFile(input, userId, body.imageSizes);
	}
}
