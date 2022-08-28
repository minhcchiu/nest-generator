import { Injectable } from '@nestjs/common';
import { FileService } from '~common/c6-files/file.service';
import { CloudinaryService } from '~lazy-modules/storage/cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Save file to Disk
   * @param body
   * @returns
   */
  async saveFileToDisk(body: { filePath: string }) {
    return body;
  }

  /**
   * Save file to S3
   * @param body
   * @returns
   */
  async saveFileToS3(body: { filePath: string }) {
    return body;
  }

  /**
   * Save file to Cloudinary
   * @param body
   * @returns
   */
  async saveFileToCloudinary(body: { filePath: string }) {
    return body;
  }
}
