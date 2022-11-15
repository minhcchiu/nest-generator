import { close, open, read, renameSync, statSync, unlinkSync } from 'fs';
import { filetypemime } from 'magic-bytes.js';
import { join } from 'path';
import { StorageServiceEnum } from '~common/c5-files/enum/storage-service.enum';
import { ResourceTypeEnum } from '~common/c4-upload/enum/resource-type.enum';
import { StorageDirEnum } from '~common/c4-upload/enum/storage-dir.enum';
import { fileHelper } from '~helper/file.helper';
import { resizeGIF, resizeJPG, resizePNG } from '~helper/resize-image.helper';

export const localStorageHelper = {
  publicDir: join(__dirname, '../../../../', 'public'),

  /**
   * Upload file
   *
   * @param filePath
   * @param uploadDir
   * @returns
   */
  async upload(filePath: string, uploadDir: StorageDirEnum, resourceType: ResourceTypeEnum) {
    const size = statSync(filePath).size || 0;
    const filemime = await this.getTypeFileTypemime(filePath);
    const type = filemime || `${resourceType}/${fileHelper.getFileName(filePath)}`;
    const file = await this.moveFileToDiskStorage(filePath, uploadDir.split('/')[2]);

    return {
      type,
      files: [fileHelper.getFileName(file)],
      size,
      folder: uploadDir,
      secureUrl: file,
      resourceID: file,
      storage: StorageServiceEnum.LOCAL_DISK,
    };
  },

  /**
   * Upload Image
   *
   * @param filePath
   * @param uploadDir
   * @returns
   */
  async uploadImage(
    filePath: string,
    uploadDir: StorageDirEnum,
    resourceType: ResourceTypeEnum = ResourceTypeEnum.IMAGE,
  ) {
    const size = statSync(filePath).size || 0;
    const filemime = await this.getTypeFileTypemime(filePath);
    const imageType = filemime.split('/')[1];
    const files = await this.compressImage(filePath, imageType);
    const type = filemime || `${resourceType}/${fileHelper.getFileName(filePath)}`;

    return {
      type,
      files,
      size,
      folder: uploadDir,
      storage: StorageServiceEnum.LOCAL_DISK,
    };
  },

  /**
   * Get type file need resize
   *
   * @param filePath
   * @returns
   */
  async getTypeFileTypemime(filePath: string) {
    const maxLength = 4100;

    const buffer = await this.getBufferFromFile(filePath, maxLength);

    const result = filetypemime(buffer);

    // check typemine
    const isValidTypemine = result && result[0] !== null;

    if (isValidTypemine) return result[0];

    return null;
  },

  /**
   * Get buffer from file
   *
   * @param filePath
   * @param maxLength
   * @returns
   */
  async getBufferFromFile(filePath: string, maxLength: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Open file
      open(filePath, 'r', (error, fd) => {
        if (error) return reject(error);

        const buffer = Buffer.alloc(maxLength);

        // Read file data
        read(fd, buffer, 0, maxLength, 0, (err) => {
          if (err) return reject(err);

          const result = (<any>buffer) as any[];

          close(fd, () => resolve(result));
        });
      });
    });
  },

  /**
   * Compress image
   *
   * @param filePath
   * @param imageType
   * @returns
   */
  async compressImage(filePath: string, imageType: string): Promise<any[]> {
    // image type = jpg|jpeg
    if (imageType === 'jpg' || imageType === 'jpeg') return this.compressJPG(filePath);

    // image type = png
    if (imageType === 'png') return this.compressPNG(filePath);

    if (imageType === 'gif') return this.compressGIF(filePath);

    return [];
  },

  /**
   * Compress JPG LocalStorage
   *
   * @param filePath
   * @returns
   */
  async compressJPG(filePath: string): Promise<any[]> {
    const fileOriginal = this.generateSizePath(filePath);
    const fileXLarge = this.generateSizePath(filePath, { width: 150 });
    const fileLarge = this.generateSizePath(filePath, { width: 360 });
    const fileMedium = this.generateSizePath(filePath, { width: 480 });
    const fileSmall = this.generateSizePath(filePath, { width: 720 });
    const fileXSmall = this.generateSizePath(filePath, { width: 1080 });

    await Promise.all([
      resizeJPG(filePath, fileOriginal.path, null),
      resizeJPG(filePath, fileXLarge.path, 150),
      resizeJPG(filePath, fileLarge.path, 360),
      resizeJPG(filePath, fileMedium.path, 480),
      resizeJPG(filePath, fileSmall.path, 720),
      resizeJPG(filePath, fileXSmall.path, 1080),
    ]);

    unlinkSync(filePath);

    return [
      fileOriginal.fileName,
      fileXLarge.fileName,
      fileLarge.fileName,
      fileMedium.fileName,
      fileSmall.fileName,
      fileXSmall.fileName,
    ];
  },

  /**
   * Compress JPG LocalStorage
   *
   * @param filePath
   * @returns
   */
  async compressGIF(filePath: string): Promise<any[]> {
    const fileOriginal = this.generateSizePath(filePath);
    const fileXLarge = this.generateSizePath(filePath, { width: 150 });
    const fileLarge = this.generateSizePath(filePath, { width: 360 });
    const fileMedium = this.generateSizePath(filePath, { width: 480 });
    const fileSmall = this.generateSizePath(filePath, { width: 720 });
    const fileXSmall = this.generateSizePath(filePath, { width: 1080 });

    await Promise.all([
      resizeGIF(filePath, fileOriginal.path, null),
      resizeGIF(filePath, fileXLarge.path, 150),
      resizeGIF(filePath, fileLarge.path, 360),
      resizeGIF(filePath, fileMedium.path, 480),
      resizeGIF(filePath, fileSmall.path, 720),
      resizeGIF(filePath, fileXSmall.path, 1080),
    ]);

    unlinkSync(filePath);

    return [
      fileOriginal.fileName,
      fileXLarge.fileName,
      fileLarge.fileName,
      fileMedium.fileName,
      fileSmall.fileName,
      fileXSmall.fileName,
    ];
  },

  /**
   * compress PNG LocalStorage
   *
   * @param filePath
   * @returns
   */
  async compressPNG(filePath: string): Promise<any[]> {
    const fileOriginal = this.generateSizePath(filePath);
    const fileXLarge = this.generateSizePath(filePath, { width: 150 });
    const fileLarge = this.generateSizePath(filePath, { width: 360 });
    const fileMedium = this.generateSizePath(filePath, { width: 480 });
    const fileSmall = this.generateSizePath(filePath, { width: 720 });
    const fileXSmall = this.generateSizePath(filePath, { width: 1080 });

    await Promise.all([
      resizePNG(filePath, fileOriginal.path, null),
      resizePNG(filePath, fileXLarge.path, 150),
      resizePNG(filePath, fileLarge.path, 360),
      resizePNG(filePath, fileMedium.path, 480),
      resizePNG(filePath, fileSmall.path, 720),
      resizePNG(filePath, fileXSmall.path, 1080),
    ]);

    unlinkSync(filePath);

    return [
      fileOriginal.fileName,
      fileXLarge.fileName,
      fileLarge.fileName,
      fileMedium.fileName,
      fileSmall.fileName,
      fileXSmall.fileName,
    ];
  },

  /**
   * Generate size path
   *
   * @param filePath
   * @param options
   * @returns
   */
  generateSizePath(filePath: string, options = {}) {
    const keyName = Object.keys(options)
      .map((key) => {
        return `${key[0]}_${options[key]}`;
      })
      .join(',');

    const fileName = this.generateFileNameResize(filePath, keyName);

    const path = join(this.publicDir, 'uploads', 'images', fileName);

    return { fileName, path };
  },

  /**
   * Movie file from temp to uploadFiles
   *
   * @param filePath
   * @returns
   */
  async moveFileToDiskStorage(filePath: string, newFolder: StorageDirEnum) {
    const newPath = filePath.replace('tmp', newFolder);

    // move file
    renameSync(filePath, newPath);

    return newPath;
  },

  /**
   * Generate file name resize
   *
   * @param filePath
   * @param keyName
   * @returns
   */
  generateFileNameResize(filePath: string, keyName: string) {
    const fileName = fileHelper.getFileName(filePath);

    const fileExt = fileName.split('.').pop();
    const originname = fileName.slice(0, -fileExt.length - 1);

    return `${originname}_${keyName}.${fileExt}`;
  },
};
