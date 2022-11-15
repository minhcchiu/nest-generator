import { Injectable } from '@nestjs/common';
import { SaveFileDto } from './dto/save-file.dto';
import { Types } from 'mongoose';
import { UploadHelper } from './upload.helper';
import { FileService } from '~common/c5-files/file.service';
import { CloudinaryService } from '~lazy-modules/storage/cloudinary/cloudinary.service';
import { LocalStorageService } from '~lazy-modules/storage/local-storage/local-storage.service';

/* eslint-disable */

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
   * @param data
   * @param owner
   * @returns
   */
  async saveFileToLocal({ file, resourceType }: SaveFileDto, owner: Types.ObjectId) {
    // check file
    const realpathOfFile = await this.uploadHelper.getRealpathOfFile(file);

    const result = await this.localStorageService.upload(realpathOfFile, resourceType);

    // save file to database
    const fileItem = {
      ...result,
      owner,
      secureUrl: result.files[0],
      resourceID: result.files[0],
    };
    return this.fileService.create(fileItem);
  }

  /**
   * Save file to Cloudinary
   *
   * @param data
   * @param owner
   * @returns
   */
  async saveFileToCloudinary({ file, resourceType }: SaveFileDto, owner: Types.ObjectId) {
    const realpathOfFile = await this.uploadHelper.getRealpathOfFile(file);

    // upload file to cloudinary
    const result = await this.cloudinaryService.upload(realpathOfFile, resourceType);

    // save file to database
    await this.fileService.create({ ...result, owner });

    // success
    return result.files;
  }

  /**
   * Save file to S3
   *
   * @param data
   * @param owner
   * @returns
   */
  async saveFileToS3({ file, resourceType }: SaveFileDto, owner: Types.ObjectId) {
    return { file, resourceType, owner };
  }
}
