import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { FileManagerService } from '~common/c6-files/file-manager.service';
import { CloudinaryService } from '~lazy-modules/storage/cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly fileManagerService: FileManagerService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Save file to Disk
   * @param filePath
   * @returns
   */
  async saveFileToDisk(filePath: string) {
    return filePath;
  }

  /**
   * Save file to S3
   * @param filePath
   * @returns
   */
  async saveFileToS3(filePath: string) {
    return filePath;
  }

  /**
   * Save file to Cloudinary
   * @param filePath
   * @returns
   */
  async saveFileToCloudinary(filePath: string) {
    // upload file to cloudinary
    const result = await this.cloudinaryService.upload(
      this.getFullFilePath(filePath),
    );

    // save file to database
    const item = {
      resourceID: result.public_id,
      format: result.format,
      type: result.resource_type,
      createdAt: result.created_at,
      size: result.bytes,
      files: [
        result.url,
        this.cloudinaryService.resizeImage(result.public_id, 200, 200),
        this.cloudinaryService.resizeImage(result.public_id, 500, 500),
        this.cloudinaryService.resizeImage(result.public_id, 300, 300),
      ],
      secureUrl: result.secure_url,
      folder: result.folder,
    };
    const file = await this.fileManagerService.create(item);

    // success
    return file.files;
  }

  /**
   * Get full file path
   * @param filePath
   * @returns
   */
  private getFullFilePath(filePath: string) {
    return join(__dirname, '../../../../', 'public', filePath);
  }
}
