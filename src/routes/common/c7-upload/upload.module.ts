import { Module } from '@nestjs/common';
import { FileManagerModule } from '~common/c6-files/file-manager.module';
import { CloudinaryModule } from '~lazy-modules/storage/cloudinary/cloudinary.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [CloudinaryModule, FileManagerModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [],
})
export class UploadModule {}
