// import { FileModule } from '~common/c5-files/file.module';

import { CloudinaryModule } from '~shared/storage/cloudinary/cloudinary.module';
import { LocalStorageModule } from '~shared/storage/local-storage/local-storage.module';

import { Module } from '@nestjs/common';

import { UploadController } from './upload.controller';
import { UploadHelper } from './upload.helper';
import { UploadService } from './upload.service';

@Module({
  imports: [CloudinaryModule, LocalStorageModule],
  controllers: [UploadController],
  providers: [UploadService, UploadHelper],
  exports: [],
})
export class UploadModule {}
