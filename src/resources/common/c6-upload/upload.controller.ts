import { ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/common/guards';
import { ConfigService } from '@nestjs/config';
import { FieldNameEnum, FieldsNameEnum } from './enum/field-name.enum';
import { ResourceTypeEnum } from './enum/resource-type.enum';
import { SaveFileDto } from './dto/save-file.dto';
import { SaveFilesDto } from './dto/save-files.dto';
import { Types } from 'mongoose';
import { UploadService } from './upload.service';
import { dbCollections } from '~config/collections/schemas.collection';
import { AppConfig } from '~config/environment';
import { GetCurrentUserId } from '~decorators/get-current-user-id.decorator';
import { StorageFileInterceptor } from '~interceptors/storage-file.interceptor';
import { StorageFilesInterceptor } from '~interceptors/storage-files.interceptor';

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { File } from '~common/c5-files/schemas/file.schema';

@ApiTags(dbCollections.upload.path)
@Controller(dbCollections.upload.path)
export class UploadController {
  private appUrl: string;
  constructor(private readonly uploadService: UploadService, private readonly configService: ConfigService) {
    this.appUrl = configService.get<AppConfig>('app').appUrl;
  }

  /**
   * Upload single file to tmp
   *
   * @param file
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.FILE))
  @Post('file')
  async uploadFileToLocal(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required!');
    const path = file.destination.replace('public/', '') + `/${file.filename}`;

    return {
      file: `${this.appUrl}/${path}`,
      resourceType: ResourceTypeEnum.FILE,
    };
  }

  /**
   * Upload many files to tmp
   *
   * @param inputFiles
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.FILES))
  @Post('files')
  async uploadFilesToLocal(@UploadedFiles() inputFiles: Express.Multer.File[]) {
    if (!inputFiles) throw new BadRequestException('Files are required!');

    const files = inputFiles.map((file: any) => {
      const path = file.destination.replace('public', '') + `/${file.filename}`;

      return `${this.appUrl}/${path}`;
    });

    return {
      files,
      resourceType: ResourceTypeEnum.FILE,
    };
  }

  /**
   * Upload single image to tmp
   *
   * @param image
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.IMAGE))
  @Post('image')
  async uploadImageToLocal(@UploadedFile() image: Express.Multer.File) {
    if (!image) throw new BadRequestException('Image is required!');
    const path = image.destination.replace('public/', '') + `/${image.filename}`;

    return {
      file: `${this.appUrl}/${path}`,
      resourceType: ResourceTypeEnum.IMAGE,
    };
  }

  /**
   * Upload many images to tmp
   *
   * @param images
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.IMAGES))
  @Post('images')
  async uploadImagesToLocal(@UploadedFiles() images: Express.Multer.File[]) {
    if (!images) throw new BadRequestException('Images are required!');

    const files = images.map((image: any) => {
      const path = image.destination.replace('public', '') + `/${image.filename}`;

      return `${this.appUrl}/${path}`;
    });

    return {
      files,
      resourceType: ResourceTypeEnum.IMAGE,
    };
  }

  /**
   * Upload single video to tmp
   *
   * @param video
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.VIDEO))
  @Post('video')
  async uploadVideoToLocal(@UploadedFile() video: Express.Multer.File) {
    if (!video) throw new BadRequestException('Video is required!');
    const path = video.destination.replace('public/', '') + `/${video.filename}`;

    return {
      file: `${this.appUrl}/${path}`,
      resourceType: ResourceTypeEnum.VIDEO,
    };
  }

  /**
   * Upload many videos to tmp
   *
   * @param videos
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.VIDEOS))
  @Post('videos')
  async uploadVideosToLocal(@UploadedFiles() videos: Express.Multer.File[]) {
    if (!videos) throw new BadRequestException('Videos are required!');

    const files = videos.map((video: any) => {
      const path = video.destination.replace('public', '') + `/${video.filename}`;

      return `${this.appUrl}/${path}`;
    });

    return {
      files,
      resourceType: ResourceTypeEnum.VIDEO,
    };
  }

  /**
   * Upload single audio to tmp
   *
   * @param audio
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFileInterceptor(FieldNameEnum.AUDIO))
  @Post('audio')
  async uploadAudioToLocal(@UploadedFile() audio: Express.Multer.File) {
    if (!audio) throw new BadRequestException('Audio is required!');

    console.log({ audio });
    const path = audio.destination.replace('public/', '') + `/${audio.filename}`;

    return {
      file: `${this.appUrl}/${path}`,
      resourceType: ResourceTypeEnum.AUDIO,
    };
  }

  /**
   * Upload single video to tmp
   *
   * @param audios
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @UseInterceptors(StorageFilesInterceptor(FieldsNameEnum.AUDIOS))
  @Post('audios')
  async uploadAudiosToLocal(@UploadedFiles() audios: Express.Multer.File[]) {
    if (!audios) throw new BadRequestException('Audios is required!');

    const files = audios.map((audio: any) => {
      const path = audio.destination.replace('public', '') + `/${audio.filename}`;

      return `${this.appUrl}/${path}`;
    });

    return {
      files,
      resourceType: ResourceTypeEnum.AUDIO,
    };
  }

  /**
   * Save file to local
   *
   * @param userId
   * @param body
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @Post('save_file_to_local')
  async saveFileToLocal(@GetCurrentUserId() userId: Types.ObjectId, @Body() { file, resourceType }: SaveFileDto) {
    file = file.replace(this.appUrl, '');

    const { files, folder } = await this.uploadService.saveFileToLocal({ file, resourceType }, userId);

    return files.map((fileName: File) => `${this.appUrl}${folder}${fileName}`);
  }

  /**
   * Save files to local
   *
   * @param userId
   * @param body
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @Post('save_files_to_local')
  async saveFilesToLocal(@GetCurrentUserId() userId: Types.ObjectId, @Body() { files, resourceType }: SaveFilesDto) {
    const filesUploadedPromise = files.map((file) => {
      file = file.replace(this.appUrl, '');

      return this.uploadService.saveFileToLocal({ file, resourceType }, userId);
    });

    const filesDoc = await Promise.all(filesUploadedPromise);
    const result = filesDoc.map((fileDoc) =>
      fileDoc.files.map((fileName: File) => `${this.appUrl}${fileDoc.folder}${fileName}`),
    );

    return { files: result };
  }

  /**
   * Save file to Cloudinary
   *
   * @param userId
   * @param body
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @Post('save_file_to_cloudinary')
  async saveFileToCloudinary(@GetCurrentUserId() userId: Types.ObjectId, @Body() { file, resourceType }: SaveFileDto) {
    file = file.replace(this.appUrl, '');

    const files = await this.uploadService.saveFileToCloudinary({ file, resourceType }, userId);

    return { files };
  }

  /**
   * Save files to Cloudinary
   *
   * @param userId
   * @param body
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @Post('save_files_to_cloudinary')
  async saveToCloudinary(@GetCurrentUserId() userId: Types.ObjectId, @Body() { files, resourceType }: SaveFilesDto) {
    const filesUploadedPromise = files.map((file) => {
      file = file.replace(this.appUrl, '');

      return this.uploadService.saveFileToCloudinary({ file, resourceType }, userId);
    });

    const result = await Promise.all(filesUploadedPromise);

    return { files: result };
  }

  /**
   * Save file to S3
   *
   * @param userId
   * @param body
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @Post('save_file_to_s3')
  async saveFileToS3(@GetCurrentUserId() userId: Types.ObjectId, @Body() { file, resourceType }: SaveFileDto) {
    const files = await this.uploadService.saveFileToS3({ file, resourceType }, userId);

    return { files };
  }

  /**
   * Save files to S3
   *
   * @param userId
   * @param body
   * @returns
   */
  @HttpCode(201)
  @UseGuards(AtGuard)
  @Post('save_files_to_s3')
  async saveFilesToS3(@GetCurrentUserId() userId: Types.ObjectId, @Body() { files, resourceType }: SaveFilesDto) {
    const filesUploadedPromise = files.map((file) => this.uploadService.saveFileToS3({ file, resourceType }, userId));

    const result = await Promise.all(filesUploadedPromise);

    return { files: result };
  }
}
