/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FileService } from '~common/c5-files/file.service';
import { CloudinaryService } from '~lazy-modules/storage/cloudinary/cloudinary.service';
import { LocalStorageService } from '~lazy-modules/storage/local-storage/local-storage.service';
import { ResourceTypeEnum } from './enum/resource-type.enum';
import { UploadHelper } from './upload.helper';
@Injectable()
export class UploadService {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly localStorageService: LocalStorageService,
    private readonly uploadHelper: UploadHelper,
  ) {}

  /**
   * Save file to local
   *
   * @param filePath
   * @returns
   */
  async saveFileToLocal(
    filePath: string,
    resourceType: ResourceTypeEnum,
    userId?: Types.ObjectId,
  ) {
    // check file
    const realpathOfFile = await this.uploadHelper.getRealpathOfFile(filePath);

    const result = await this.localStorageService.upload(
      realpathOfFile,
      resourceType,
    );

    // save file to database
    await this.fileService.create({
      ...result,
      // owner: userId,
    });

    return result.files;
  }

  /**
   * Save file to Cloudinary
   *
   * @param filePath
   * @returns
   */
  async saveFileToCloudinary(
    filePath: string,
    resourceType: ResourceTypeEnum,
    userId?: Types.ObjectId,
  ) {
    const realpathOfFile = await this.uploadHelper.getRealpathOfFile(filePath);

    // upload file to cloudinary
    const result = await this.cloudinaryService.upload(
      realpathOfFile,
      resourceType,
    );

    // save file to database

    await this.fileService.create({
      ...result,
      // owner:
    });

    // success
    return result.files;
  }

  /**
   * Save file to S3
   *
   * @param filePath
   * @returns
   */
  async saveFileToS3(filePath: string, userId?: Types.ObjectId) {
    return { filePath, userId };
  }
}
