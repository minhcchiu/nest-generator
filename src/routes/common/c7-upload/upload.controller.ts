import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { schemas } from '~config/collections/schemas.collection';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { tempStorage } from '~helper/storage.helper';

@ApiTags(schemas.upload.path)
@Controller(schemas.upload.path)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload single file to tmp
   * @param file
   */
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  @Post('file')
  async uploadFileToLocal(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required!');

    return { file: file.path.replace('public/', '') };
  }

  /**
   * Upload many files to tmp
   * @param files
   */
  @UseInterceptors(FilesInterceptor('files', 25, tempStorage))
  @HttpCode(201)
  @Post('files')
  async uploadFilesToLocal(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      files: files.map((file: any) => file.path.replace('public/', '')),
    };
  }

  /**
   * Save file to local local
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_file_to_local')
  async saveFileToLocal(@Body() body: { file: string }) {
    return this.uploadService.saveFileToLocal(body.file);
  }

  /**
   * Save files to local disk
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_files_to_local')
  async saveFilesToLocal(@Body() body: { files: string[] }) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToLocal(file),
    );

    return Promise.all(filesUploadedPromise);
  }

  /**
   * Save file to s3
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_file_to_s3')
  async saveFileToS3(@Body() body: { file: string }) {
    return body;
  }

  /**
   * Save files to s3
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_files_to_s3')
  async saveFilesToS3(@Body() body: { files: string[] }) {
    return body;
  }

  /**
   * Save file to cloudinary
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_file_to_cloudinary')
  async saveFileToCloudinary(@Body() body: { file: string }) {
    return this.uploadService.saveFileToCloudinary(body.file);
  }

  /**
   * Save files to cloudinary
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_files_to_cloudinary')
  async saveToCloudinary(@Body() body: { files: string[] }) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToLocal(file),
    );

    return Promise.all(filesUploadedPromise);
  }
}
