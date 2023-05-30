import { ObjectId } from 'mongodb';
import { CloudinaryService } from '~shared/storage/cloudinary/cloudinary.service';
import { LocalStorageService } from '~shared/storage/local-storage/local-storage.service';

import { Injectable } from '@nestjs/common';

import { SaveFileDto } from './dto/save-file.dto';
import { UploadHelper } from './upload.helper';

@Injectable()
export class UploadService {
  constructor(
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
  async saveFileToLocal({ file, resourceType }: SaveFileDto, owner: ObjectId) {
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
    return fileItem;
  }

  /**
   * Save file to Cloudinary
   *
   * @param data
   * @param owner
   * @returns
   */
  async saveFileToCloudinary({ file, resourceType }: SaveFileDto, owner: ObjectId) {
    const realpathOfFile = await this.uploadHelper.getRealpathOfFile(file);

    // upload file to cloudinary
    const result = await this.cloudinaryService.upload(realpathOfFile, resourceType);

    // save file to database
    // await this.fileService.create({ ...result, owner });

    // success
    console.log(owner);
    return result.files;
  }

  /**
   * Save file to S3
   *
   * @param data
   * @param owner
   * @returns
   */
  async saveFileToS3({ file, resourceType }: SaveFileDto, owner: ObjectId) {
    return { file, resourceType, owner };
  }
}
