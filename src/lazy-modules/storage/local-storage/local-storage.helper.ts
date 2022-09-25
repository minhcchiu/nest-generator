import { join } from 'path';
import { close, open, read, renameSync, unlinkSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { filetypemime } from 'magic-bytes.js';

import { resizeGIF, resizeJPG, resizePNG } from '~helper/resize-image.helper';
import { StorageDirEnum } from '~common/c6-upload/enum/storage-dir.enum';

@Injectable()
export class LocalStorageHelper {
  private publicDir: string;
  constructor() {
    this.publicDir = join(__dirname, '../../../../', 'public');
  }

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
  }

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
  }

  /**
   * Compress image
   *
   * @param filePath
   * @param imageType
   * @returns
   */
  async compressImage(filePath: string, imageType: string): Promise<any[]> {
    // image type = jpg|jpeg
    if (imageType === 'jpg' || imageType === 'jpeg')
      return this.compressJPG(filePath);

    // image type = png
    if (imageType === 'png') return this.compressPNG(filePath);

    if (imageType === 'gif') return this.compressGIF(filePath);

    return [];
  }

  /**
   * Compress JPG LocalStorage
   *
   * @param filePath
   * @returns
   */
  private async compressJPG(filePath: string): Promise<any[]> {
    const filePathOriginal = this.generateSizePath(filePath);
    const filePathXLarge = this.generateSizePath(filePath, { width: 150 });
    const filePathLarge = this.generateSizePath(filePath, { width: 360 });
    const filePathMedium = this.generateSizePath(filePath, { width: 480 });
    const filePathSmall = this.generateSizePath(filePath, { width: 720 });
    const filePathXSmall = this.generateSizePath(filePath, { width: 1080 });

    await Promise.all([
      resizeJPG(filePath, filePathOriginal, null),
      resizeJPG(filePath, filePathXLarge, 150),
      resizeJPG(filePath, filePathLarge, 360),
      resizeJPG(filePath, filePathMedium, 480),
      resizeJPG(filePath, filePathSmall, 720),
      resizeJPG(filePath, filePathXSmall, 1080),
    ]);

    unlinkSync(filePath);

    return [
      filePathOriginal,
      filePathXLarge,
      filePathLarge,
      filePathMedium,
      filePathSmall,
      filePathXSmall,
    ];
  }

  /**
   * Compress JPG LocalStorage
   *
   * @param filePath
   * @returns
   */
  private async compressGIF(filePath: string): Promise<any[]> {
    const filePathOriginal = this.generateSizePath(filePath);
    const filePathXLarge = this.generateSizePath(filePath, { width: 150 });
    const filePathLarge = this.generateSizePath(filePath, { width: 360 });
    const filePathMedium = this.generateSizePath(filePath, { width: 480 });
    const filePathSmall = this.generateSizePath(filePath, { width: 720 });
    const filePathXSmall = this.generateSizePath(filePath, { width: 1080 });

    await Promise.all([
      resizeGIF(filePath, filePathOriginal, null),
      resizeGIF(filePath, filePathXLarge, 150),
      resizeGIF(filePath, filePathLarge, 360),
      resizeGIF(filePath, filePathMedium, 480),
      resizeGIF(filePath, filePathSmall, 720),
      resizeGIF(filePath, filePathXSmall, 1080),
    ]);

    unlinkSync(filePath);

    return [
      filePathOriginal,
      filePathXLarge,
      filePathLarge,
      filePathMedium,
      filePathSmall,
      filePathXSmall,
    ];
  }

  /**
   * compress PNG LocalStorage
   *
   * @param filePath
   * @returns
   */
  private async compressPNG(filePath: string): Promise<any[]> {
    const filePathOriginal = this.generateSizePath(filePath);
    const filePathXLarge = this.generateSizePath(filePath, { width: 150 });
    const filePathLarge = this.generateSizePath(filePath, { width: 360 });
    const filePathMedium = this.generateSizePath(filePath, { width: 480 });
    const filePathSmall = this.generateSizePath(filePath, { width: 720 });
    const filePathXSmall = this.generateSizePath(filePath, { width: 1080 });

    await Promise.all([
      resizePNG(filePath, filePathOriginal, null),
      resizePNG(filePath, filePathXLarge, 150),
      resizePNG(filePath, filePathLarge, 360),
      resizePNG(filePath, filePathMedium, 480),
      resizePNG(filePath, filePathSmall, 720),
      resizePNG(filePath, filePathXSmall, 1080),
    ]);

    unlinkSync(filePath);

    return [
      filePathOriginal,
      filePathXLarge,
      filePathLarge,
      filePathMedium,
      filePathSmall,
      filePathXSmall,
    ];
  }

  /**
   * Genrate size path
   *
   * @param filePath
   * @param options
   * @returns
   */
  private generateSizePath(filePath: string, options = {}) {
    const keyName = Object.keys(options)
      .map((key) => {
        return `${key[0]}_${options[key]}`;
      })
      .join(',');

    const fileName = this.generateFileNameResize(filePath, keyName);

    return join(this.publicDir, 'uploads', 'images', fileName);
  }

  /**
   * Movie file from temp to uploadFiles
   *
   * @param filePath
   * @returns
   */
  async moveFileToDiskStorage(filePath: string, newFolder: StorageDirEnum) {
    const newPath = filePath.replace('/uploads/tmp/', newFolder);

    // move file
    renameSync(filePath, newPath);

    return newPath;
  }

  /**
   * Get fileName from filePath
   *
   * @param filePath
   * @returns
   */
  public getFileName(filePath: string) {
    const lastIndexOfSlash = filePath.lastIndexOf('/');
    const fileName = filePath.slice(lastIndexOfSlash + 1);

    return fileName;
  }

  /**
   * Generate file name resize
   *
   * @param filePath
   * @param keyName
   * @returns
   */

  private generateFileNameResize(filePath: string, keyName: string) {
    const fileName = this.getFileName(filePath);

    const fileExt = fileName.split('.').pop();
    const originname = fileName.slice(0, -fileExt.length - 1);

    return `${originname}_${keyName}.${fileExt}`;
  }
}
