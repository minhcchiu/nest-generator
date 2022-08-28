import { Module } from '@nestjs/common';
import { FileModule } from '~common/c6-files/file.module';
import { CloudinaryModule } from '~lazy-modules/storage/cloudinary/cloudinary.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [CloudinaryModule, FileModule],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {}
