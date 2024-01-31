import { diskStorage } from "multer";
import { UploadConfig } from "~config/environment";
import { editFileName, fileFilterValidator } from "~helpers/storage.helper";
import { FieldNameEnum } from "~routes/pre-built/7-uploads/enum/field-name.enum";

import { Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";

export const StorageFileInterceptor = (
	fieldName: FieldNameEnum,
): Type<NestInterceptor> => {
	@Injectable()
	class Interceptor implements NestInterceptor {
		fileInterceptor: NestInterceptor;
		destination = "public/uploads/tmp";

		constructor(private configService: ConfigService) {
			const multerOption = this.getMulterOptions();

			this.fileInterceptor = new (FileInterceptor(fieldName, multerOption))();
		}

		intercept(...args: Parameters<NestInterceptor["intercept"]>) {
			return this.fileInterceptor.intercept(...args);
		}

		private getMulterOptions() {
			const uploadConfig = this.configService.get<UploadConfig>("upload");

			// options files
			let options = {
				fileSize: uploadConfig.imageMaxSize,
				extAllowed: uploadConfig.imagesExt,
			};

			// Check upload video -> options upload video
			if (fieldName === FieldNameEnum.FILE)
				options = {
					fileSize: uploadConfig.rawMaxSize,
					extAllowed: uploadConfig.rawExt,
				};

			// Check upload video -> options upload video
			if (fieldName === FieldNameEnum.VIDEO)
				options = {
					fileSize: uploadConfig.videoMaxSize,
					extAllowed: uploadConfig.videoExt,
				};

			// Check upload auto -> options upload auto
			if (fieldName === FieldNameEnum.AUTO)
				options = {
					fileSize: uploadConfig.autoMaxSize,
					extAllowed: uploadConfig.autoExt,
				};

			return {
				storage: diskStorage({
					destination: this.destination,
					filename: editFileName,
				}),

				limits: { fileSize: Math.pow(1024, options.fileSize) },

				fileFilterValidator: (req: any, file: any, callback: any) => {
					fileFilterValidator(req, file, callback);
				},
			};
		}
	}

	return mixin(Interceptor);
};
