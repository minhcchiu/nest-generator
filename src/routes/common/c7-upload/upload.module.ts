import { Module } from '@nestjs/common';
import { FileManagerModule } from '~common/c6-files/file-manager.module';
import { CloudinaryModule } from '~lazy-modules/storage/cloudinary/cloudinary.module';
import { LocalStorageModule } from '~lazy-modules/storage/local-storage/local-storage.module';
import { UploadController } from './upload.controller';
import { UploadHelper } from './upload.helper';
import { UploadService } from './upload.service';

@Module({
  imports: [CloudinaryModule, FileManagerModule, LocalStorageModule],
  controllers: [UploadController],
  providers: [UploadService, UploadHelper],
  exports: [],
})
export class UploadModule {}
