import { FilesInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '~helper/storage.helper';
import { UploadConfig } from '~config/enviroment';
import { FieldsNameEnum } from '~common/c6-upload/enum/field-name.enum';

export const StorageFilesInterceptor = (
  fieldName: FieldsNameEnum,
): Type<NestInterceptor> => {
  @Injectable()
  class Interceptor implements NestInterceptor {
    filesInterceptor: NestInterceptor;
    destination = 'public/uploads/tmp';

    /**
     * Constructor
     *
     * @param configService
     */
    constructor(private configService: ConfigService) {
      const multerOption = this.getMulterOptions();
      const uploadConfig = this.configService.get<UploadConfig>('upload');

      // init max files
      let maxFiles = uploadConfig.maxFiles;

      // set maxFile if fieldName is video
      if (fieldName === FieldsNameEnum.VIDEOS)
        maxFiles = uploadConfig.maxVideos;

      // set maxFile if fieldName is audio
      if (fieldName === FieldsNameEnum.AUDIOS)
        maxFiles = uploadConfig.maxAudios;

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
    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.filesInterceptor.intercept(...args);
    }

    /**
     * Get multerOptions
     *
     * @returns
     */
    private getMulterOptions() {
      const uploadConfig = this.configService.get<UploadConfig>('upload');

      // options files
      let options = {
        fileSize: uploadConfig.maxSize,
        extAllowed: uploadConfig.extFiles,
      };

      // Check upload video -> options upload video
      if (fieldName === FieldsNameEnum.VIDEOS)
        options = {
          fileSize: uploadConfig.maxVideoSize,
          extAllowed: uploadConfig.extVideo,
        };

      // Check upload audio -> options upload audio
      if (fieldName === FieldsNameEnum.AUDIOS)
        options = {
          fileSize: uploadConfig.maxAudios,
          extAllowed: uploadConfig.extAudio,
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
