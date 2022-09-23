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
import { StorageAudioInterceptor } from '~interceptors/storage-audio.interceptor';
import { StorageAudiosInterceptor } from '~interceptors/storage-audios.interceptor';
import { StorageFileInterceptor } from '~interceptors/storage-file.interceptor';
import { StorageFilesInterceptor } from '~interceptors/storage-files.interceptor';
import { StorageVideoInterceptor } from '~interceptors/storage-video.interceptor';
import { StorageVideosInterceptor } from '~interceptors/storage-videos.interceptor';
import { SaveFileDto } from './dto/save-file.dto';
import { SaveFilesDto } from './dto/save-files.dto';
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
    if (!files) throw new BadRequestException('Files is required!');

    return {
      files: files.map((file: any) => file.path.replace('public/', '')),
    };
  }

  /**
   * Upload single video to tmp
   *
   * @param video
   * @returns
   */
  @UseInterceptors(StorageVideoInterceptor('video'))
  @HttpCode(201)
  @Post('video')
  async uploadVideoToLocal(@UploadedFile() video: Express.Multer.File) {
    // check file exist
    if (!video) throw new BadRequestException('Video is required!');

    return { file: video.path.replace('public/', '') };
  }

  /**
   * Upload many videos to tmp
   *
   * @param videos
   * @returns
   */
  @UseInterceptors(StorageVideosInterceptor('videos'))
  @HttpCode(201)
  @Post('videos')
  async uploadVideosToLocal(@UploadedFiles() videos: Express.Multer.File[]) {
    // check file exist
    if (!videos) throw new BadRequestException('Video is required!');

    return {
      files: videos.map((file: any) => file.path.replace('public/', '')),
    };
  }

  /**
   * Upload single audio to tmp
   *
   * @param audio
   * @returns
   */
  @UseInterceptors(StorageAudioInterceptor('audio'))
  @HttpCode(201)
  @Post('audio')
  async uploadAudioToLocal(@UploadedFile() audio: Express.Multer.File) {
    // check file exist
    if (!audio) throw new BadRequestException('Audio is required!');

    return { file: audio.path.replace('public/', '') };
  }

  /**
   * Upload single video to tmp
   *
   * @param audios
   * @returns
   */
  @UseInterceptors(StorageAudiosInterceptor('audios'))
  @HttpCode(201)
  @Post('audios')
  async uploadAudiosToLocal(@UploadedFiles() audios: Express.Multer.File[]) {
    // check file exist
    if (!audios) throw new BadRequestException('Video is required!');

    return {
      files: audios.map((file: any) => file.path.replace('public/', '')),
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
    @Body() body: SaveFileDto,
  ) {
    const files = await this.uploadService.saveFileToLocal(body.file);

    return { files };
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
    @Body() body: SaveFilesDto,
  ) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToLocal(file),
    );

    const files = await Promise.all(filesUploadedPromise);

    return { files };
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
    @Body() body: SaveFileDto,
  ) {
    const files = await this.uploadService.saveVideoToLocal(body.file);

    return { files };
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
    @Body() body: SaveFilesDto,
  ) {
    const videosUploadedPromise = body.files.map((file: string) =>
      this.uploadService.saveVideoToLocal(file),
    );

    const files = await Promise.all(videosUploadedPromise);

    return { files };
  }

  /**
   * Save files to local
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_audio_to_local')
  async saveAudioToLocal(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: SaveFileDto,
  ) {
    const files = await this.uploadService.saveAudioToLocal(body.file);

    return { files };
  }

  /**
   * Save files to local
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save_audios_to_local')
  async saveAudiosToLocal(
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: SaveFilesDto,
  ) {
    const videosUploadedPromise = body.files.map((file: string) =>
      this.uploadService.saveAudioToLocal(file),
    );

    const files = await Promise.all(videosUploadedPromise);

    return { files };
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
    @Body() body: SaveFileDto,
  ) {
    const files = await this.uploadService.saveFileToCloudinary(
      body.file,
      userId,
    );

    return { files };
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

    const files = await Promise.all(filesUploadedPromise);

    return { files };
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
    @Body() body: SaveFileDto,
  ) {
    const files = await this.uploadService.saveFileToS3(body.file);

    return { files };
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
    @Body() body: SaveFilesDto,
  ) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToS3(file),
    );

    const files = await Promise.all(filesUploadedPromise);

    return { files };
  }
}
