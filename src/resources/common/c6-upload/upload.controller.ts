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
import { Types } from 'mongoose';
import { dbCollections } from '~config/collections/schemas.collection';
import { GetCurrentUserId } from '~decorators/get-current-user-id.decorator';
import { StorageFileInterceptor } from '~interceptors/storage-file.interceptor';
import { StorageFilesInterceptor } from '~interceptors/storage-files.interceptor';
import { StorageVideoInterceptor } from '~interceptors/storage-video.interceptor';
import { StorageVideosInterceptor } from '~interceptors/storage-videos.interceptor';
import { UploadService } from './upload.service';

@ApiTags(dbCollections.upload.path)
@Controller(dbCollections.upload.path)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload single file to tmp
   *
   * @param file
   * @returns
   */
  @UseInterceptors(StorageFileInterceptor('file'))
  @HttpCode(201)
  @Post('file')
  async uploadFileToLocal(@UploadedFile() file: Express.Multer.File) {
    // check file exist
    if (!file) throw new BadRequestException('File is required!');

    return { file: file.path.replace('public/', '') };
  }

  /**
   * Upload many files to tmp
   *
   * @param files
   * @returns
   */
  @UseInterceptors(StorageFilesInterceptor('files'))
  @HttpCode(201)
  @Post('files')
  async uploadFilesToLocal(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      files: files.map((file: any) => file.path.replace('public/', '')),
    };
  }

  /**
   * Upload many videos to tmp
   *
   * @param video
   * @returns
   */
  @UseInterceptors(StorageVideoInterceptor('file'))
  @HttpCode(201)
  @Post('video')
  async uploadVideosToLocal(@UploadedFile() video: Express.Multer.File) {
    // check file exist
    if (!video) throw new BadRequestException('Video is required!');

    return { file: video.path.replace('public/', '') };
  }

  /**
   * Upload single video to tmp
   *
   * @param videos
   * @returns
   */
  @UseInterceptors(StorageVideosInterceptor('files'))
  @HttpCode(201)
  @Post('videos')
  async uploadVideoToLocal(@UploadedFiles() videos: Express.Multer.File[]) {
    // check file exist
    if (!videos) throw new BadRequestException('Video is required!');

    return {
      files: videos.map((file: any) => file.path.replace('public/', '')),
    };
  }

  /**
   * Save file to local
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_file_to_local')
  async saveFileToLocal(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { file: string },
  ) {
    return this.uploadService.saveFileToLocal(body.file);
  }

  /**
   * Save files to local
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_files_to_local')
  async saveFilesToLocal(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { files: string[] },
  ) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToLocal(file),
    );

    return Promise.all(filesUploadedPromise);
  }

  /**
   * Save files to local
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_video_to_local')
  async saveVideoToLocal(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { file: string },
  ) {
    return this.uploadService.saveVideoToLocal(body.file);
  }

  /**
   * Save files to local
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_videos_to_local')
  async saveVideosToLocal(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { files: string[] },
  ) {
    const videosUploadedPromise = body.files.map((file: string) =>
      this.uploadService.saveVideoToLocal(file),
    );

    return Promise.all(videosUploadedPromise);
  }

  /**
   * Save file to S3
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_file_to_s3')
  async saveFileToS3(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { file: string },
  ) {
    return this.uploadService.saveFileToS3(body.file);
  }

  /**
   * Save files to S3
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_files_to_s3')
  async saveFilesToS3(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { files: string[] },
  ) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToS3(file),
    );

    return Promise.all(filesUploadedPromise);
  }

  /**
   * Save file to Cloudinary
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_file_to_cloudinary')
  async saveFileToCloudinary(
    @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { file: string },
  ) {
    return this.uploadService.saveFileToCloudinary(body.file, userId);
  }

  /**
   * Save files to Cloudinary
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_files_to_cloudinary')
  async saveToCloudinary(
    @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: { files: string[] },
  ) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToCloudinary(file, userId),
    );

    return Promise.all(filesUploadedPromise);
  }
}
