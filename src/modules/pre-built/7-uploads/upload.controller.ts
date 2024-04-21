import {
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
import { EnvStatic } from "src/configurations/static.env";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { UploadService } from "./upload.service";
console.log({ filesLimit: EnvStatic.getUploadConfig().filesLimit });
@Controller("uploads")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post("files")
	@UseInterceptors(
		FilesInterceptor("files", EnvStatic.getUploadConfig().filesLimit),
	)
	@HttpCode(HttpStatus.CREATED)
	async uploadFiles(
		@GetCurrentUserId() userId: Types.ObjectId,
		@UploadedFiles()
		inputs: Array<Express.Multer.File>,
	) {
		return this.uploadService.uploadFiles(inputs, userId);
	}

	@Post("file")
	@UseInterceptors(FileInterceptor("file"))
	@HttpCode(HttpStatus.CREATED)
	async uploadFile(
		@GetCurrentUserId() userId: Types.ObjectId,
		@UploadedFile()
		input: Express.Multer.File,
	) {
		return this.uploadService.uploadFile(input, userId);
	}
}
