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
// import { Types } from 'mongoose';
import { dbCollections } from '~config/collections/schemas.collection';
// import { GetCurrentUserId } from '~decorators/get-current-user-id.decorator';
import { StorageFilesInterceptor } from '~interceptors/storage-files.interceptor';
import { SaveFileDto } from './dto/save-file.dto';
import { SaveFilesDto } from './dto/save-files.dto';
import { ResourceTypeEnum } from './enum/resource-type.enum';
import { UploadService } from './upload.service';
import { FieldNameEnum, FieldsNameEnum } from './enum/field-name.enum';
import { StorageFileInterceptor } from '~interceptors/storage-file.interceptor';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '~config/enviroment';

@ApiTags(dbCollections.upload.path)
@Controller(dbCollections.upload.path)
export class UploadController {
  private appUrl: string;
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl = configService.get<AppConfig>('app').appUrl;
  }

  /**
   * Upload single file to tmp
   *
   * @param file
   * @returns
   */
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.FILE))
  @HttpCode(201)
  @Post('file')
  async uploadFileToLocal(@UploadedFile() file: Express.Multer.File) {
    // check file exist
    if (!file) throw new BadRequestException('File is required!');

    return {
      file: this.appUrl + '/' + file.path.replace('public/', ''),
      resourceType: ResourceTypeEnum.FILE,
    };
  }

  /**
   * Upload many files to tmp
   *
   * @param files
   * @returns
   */
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.FILES))
  @HttpCode(201)
  @Post('files')
  async uploadFilesToLocal(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files) throw new BadRequestException('Files are required!');

    return {
      files: files.map(
        (file: any) => this.appUrl + '/' + file.path.replace('public/', ''),
      ),
      resourceType: ResourceTypeEnum.FILE,
    };
  }

  /**
   * Upload single image to tmp
   *
   * @param image
   * @returns
   */
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.IMAGE))
  @HttpCode(201)
  @Post('image')
  async uploadImageToLocal(@UploadedFile() image: Express.Multer.File) {
    // check image exist
    if (!image) throw new BadRequestException('Image is required!');

    return {
      file: this.appUrl + '/' + image.path.replace('public/', ''),
      resourceType: ResourceTypeEnum.IMAGE,
    };
  }

  /**
   * Upload many images to tmp
   *
   * @param images
   * @returns
   */
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.IMAGES))
  @HttpCode(201)
  @Post('images')
  async uploadImagesToLocal(@UploadedFiles() images: Express.Multer.File[]) {
    if (!images) throw new BadRequestException('Images are required!');

    return {
      files: images.map(
        (image: any) => this.appUrl + '/' + image.path.replace('public/', ''),
      ),
      resourceType: ResourceTypeEnum.IMAGE,
    };
  }

  /**
   * Upload single video to tmp
   *
   * @param video
   * @returns
   */
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.VIDEO))
  @HttpCode(201)
  @Post('video')
  async uploadVideoToLocal(@UploadedFile() video: Express.Multer.File) {
    // check file exist
    if (!video) throw new BadRequestException('Video is required!');

    return {
      file: this.appUrl + '/' + video.path.replace('public/', ''),
      resourceType: ResourceTypeEnum.VIDEO,
    };
  }

  /**
   * Upload many videos to tmp
   *
   * @param videos
   * @returns
   */
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.VIDEOS))
  @HttpCode(201)
  @Post('videos')
  async uploadVideosToLocal(@UploadedFiles() videos: Express.Multer.File[]) {
    // check file exist
    if (!videos) throw new BadRequestException('Videos are required!');

    return {
      files: videos.map(
        (video: any) => this.appUrl + '/' + video.path.replace('public/', ''),
      ),
      resourceType: ResourceTypeEnum.VIDEO,
    };
  }

  /**
   * Upload single audio to tmp
   *
   * @param audio
   * @returns
   */
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.AUDIO))
  @HttpCode(201)
  @Post('audio')
  async uploadAudioToLocal(@UploadedFile() audio: Express.Multer.File) {
    // check file exist
    if (!audio) throw new BadRequestException('Audio is required!');

    return {
      file: this.appUrl + '/' + audio.path.replace('public/', ''),
      resourceType: ResourceTypeEnum.AUDIO,
    };
  }

  /**
   * Upload single video to tmp
   *
   * @param audios
   * @returns
   */
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.AUDIOS))
  @HttpCode(201)
  @Post('audios')
  async uploadAudiosToLocal(@UploadedFiles() audios: Express.Multer.File[]) {
    // check file exist
    if (!audios) throw new BadRequestException('Audios is required!');

    return {
      files: audios.map(
        (audio: any) => this.appUrl + '/' + audio.path.replace('public/', ''),
      ),
      resourceType: ResourceTypeEnum.AUDIO,
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
    const files = await this.uploadService.saveFileToLocal(
      body.file.replace(this.appUrl, ''),
      body.resourceType,
    );

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
      this.uploadService.saveFileToLocal(
        file.replace(this.appUrl, ''),
        body.resourceType,
      ),
    );

    const files = await Promise.all(filesUploadedPromise);

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
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: SaveFileDto,
  ) {
    const files = await this.uploadService.saveFileToCloudinary(
      body.file.replace(this.appUrl, ''),
      body.resourceType,
      // userId,
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
    // @GetCurrentUserId() userId: Types.ObjectId,
    @Body() body: SaveFilesDto,
  ) {
    const filesUploadedPromise = body.files.map((file) =>
      this.uploadService.saveFileToCloudinary(file, body.resourceType),
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
