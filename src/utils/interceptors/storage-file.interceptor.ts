import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '~helper/storage.helper';
import { UploadConfig } from '~config/enviroment';

function StorageFileInterceptor(fieldName: string): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    destination = 'public/uploads/tmp';

    /**
     * Constructor
     *
     * @param configService
     */
    constructor(private configService: ConfigService) {
      const multerOption = this.getMulterOptions();

      this.fileInterceptor = new (FileInterceptor(fieldName, multerOption))();
    }

    /**
     * Intercept
     *
     * @param args
     * @returns
     */
    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }

    /**
     * Get multerOptions
     *
     * @returns
     */
    private getMulterOptions() {
      const uploadConfig = this.configService.get<UploadConfig>('upload');

      const fileSize = Math.pow(1024, uploadConfig.maxSize);
      const extAllowed = uploadConfig.extFiles;

      return {
        storage: diskStorage({
          destination: this.destination,
          filename: editFileName,
        }),

        limits: { fileSize },

        fileFilter: (req: any, file: any, callback: any) => {
          imageFileFilter(extAllowed, req, file, callback);
        },
      };
    }
  }

  return mixin(Interceptor);
}

export { StorageFileInterceptor };
