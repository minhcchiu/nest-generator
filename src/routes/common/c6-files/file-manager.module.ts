import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '~lazy-modules/storage/cloudinary/cloudinary.module';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file-manager.service';
import { FileManager, FileManagerSchema } from './schemas/file-manager.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FileManager.name,
        schema: FileManagerSchema,
      },
    ]),
    CloudinaryModule,
  ],
  controllers: [FileManagerController],
  providers: [FileManagerService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
