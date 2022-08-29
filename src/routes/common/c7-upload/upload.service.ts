import { Injectable } from '@nestjs/common';
import { FileManagerService } from '~common/c6-files/file-manager.service';
import { CloudinaryService } from '~lazy-modules/storage/cloudinary/cloudinary.service';
import { LocalDiskService } from '~lazy-modules/storage/local-disk/local-disk.service';
import { UploadHelper } from './upload.helper';

@Injectable()
export class UploadService {
  constructor(
    private readonly fileManagerService: FileManagerService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly localDiskService: LocalDiskService,
    private readonly uploadHelper: UploadHelper,
  ) {}

  /**
   * Save file to Disk
   * @param filePath
   * @returns
   */
  async saveFileToDisk(filePath: string) {
    // check file
    const realpathOfFile = await this.uploadHelper.getRealpathOfFile(filePath);

    const result = await this.localDiskService.upload(realpathOfFile);

    const { files, size, folder } = result;
    const [type, format] = result?.type?.split('/')
      ? result.type.split('/')
      : ['files', realpathOfFile.slice(realpathOfFile.lastIndexOf('.') + 1)];

    // save file to database
    const item = {
      resourceID: files[0],
      format,
      type,
      size,
      files,
      folder,
      storage: 'LOCAL_DISK',
    };

    await this.fileManagerService.create(item);

    return result;
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
    const realpathOfFile = await this.uploadHelper.getRealpathOfFile(filePath);

    console.log({ realpathOfFile });
    // upload file to cloudinary
    const result = await this.cloudinaryService.upload(realpathOfFile);

    // save file to database
    const item = {
      resourceID: result.public_id,
      format: result.format,
      type: result.resource_type,
      createdAt: result.created_at,
      size: result.bytes,
      files: [
        result.url,
        this.cloudinaryService.resizeImage(result.public_id, 1080),
        this.cloudinaryService.resizeImage(result.public_id, 720),
        this.cloudinaryService.resizeImage(result.public_id, 360),
        this.cloudinaryService.resizeImage(result.public_id, 480),
        this.cloudinaryService.resizeImage(result.public_id, 360),
        this.cloudinaryService.resizeImage(result.public_id, 150),
      ],
      secureUrl: result.secure_url,
      folder: result.folder,
      storage: 'S3',
    };

    const file = await this.fileManagerService.create(item);

    // success
    return file.files;
  }
}
