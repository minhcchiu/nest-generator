import { diskStorage } from "multer";
import { UploadConfig } from "~config/environment";
import { editFileName, imageFileFilter } from "~helpers/storage.helper";
import { FieldsNameEnum } from "~routes/1-upload/enum/field-name.enum";

import { Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FilesInterceptor } from "@nestjs/platform-express";

export const StorageFilesInterceptor = (
	fieldName: FieldsNameEnum,
): Type<NestInterceptor> => {
	@Injectable()
	class Interceptor implements NestInterceptor {
		filesInterceptor: NestInterceptor;
		destination = "public/uploads/tmp";

		/**
		 * Constructor
		 *
		 * @param configService
		 */
		constructor(private configService: ConfigService) {
			const multerOption = this.getMulterOptions();
			const uploadConfig = this.configService.get<UploadConfig>("upload");

			// init max files
			let maxFiles = uploadConfig.imageMaxFiles;

			// set maxFile if fieldName is file
			if (fieldName === FieldsNameEnum.FILES)
				maxFiles = uploadConfig.rawMaxFiles;

			// set maxFile if fieldName is video
			if (fieldName === FieldsNameEnum.VIDEOS)
				maxFiles = uploadConfig.videoMaxFiles;

			// set maxFile if fieldName is audio
			if (fieldName === FieldsNameEnum.AUDIOS)
				maxFiles = uploadConfig.audioMaxFiles;

			//  init file interceptor
			this.filesInterceptor = new (FilesInterceptor(
				fieldName,
				maxFiles,
				multerOption,
			))();
		}

		/**
		 * Intercept
		 *
		 * @param args
		 * @returns
		 */
		intercept(...args: Parameters<NestInterceptor["intercept"]>) {
			return this.filesInterceptor.intercept(...args);
		}

		/**
		 * Get multerOptions
		 *
		 * @returns
		 */
		private getMulterOptions() {
			const uploadConfig = this.configService.get<UploadConfig>("upload");
			// options files
			let options = {
				fileSize: uploadConfig.imageMaxSize,
				extAllowed: uploadConfig.imagesExt,
			};

			// Check upload video -> options upload video
			if (fieldName === FieldsNameEnum.FILES)
				options = {
					fileSize: uploadConfig.rawMaxSize,
					extAllowed: uploadConfig.rawExt,
				};

			// Check upload video -> options upload video
			if (fieldName === FieldsNameEnum.VIDEOS)
				options = {
					fileSize: uploadConfig.videoMaxSize,
					extAllowed: uploadConfig.videoExt,
				};

			// Check upload audio -> options upload audio
			if (fieldName === FieldsNameEnum.AUDIOS)
				options = {
					fileSize: uploadConfig.audioMaxSize,
					extAllowed: uploadConfig.audioExt,
				};

			return {
				storage: diskStorage({
					destination: this.destination,
					filename: editFileName,
				}),

				limits: { fileSize: Math.pow(1024, options.fileSize) },

				fileFilter: (req: any, file: any, callback: any) => {
					imageFileFilter(options.extAllowed, req, file, callback);
				},
			};
		}
	}

	return mixin(Interceptor);
};
