import { join } from 'path';
import { close, open, read, renameSync, unlinkSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { filetypemime } from 'magic-bytes.js';

import { resizeJPG, resizePNG } from '~helper/resize-image.helper';

@Injectable()
export class LocalStorageHelper {
  private uploadDir: string;
  constructor() {
    this.uploadDir = join(__dirname, '../../../../', 'public', 'uploads');
  }

  /**
   * Get type file need resize
   *
   * @param filePath
   * @returns
   */
  async getTypeFileNeedResize(filePath: string) {
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

    return [];
  }

  /**
   * Compress JPG LocalStorage
   *
   * @param filePath
   * @returns
   */
  private async compressJPG(filePath: string): Promise<any[]> {
    await Promise.all([
      resizeJPG(filePath, this.generateSizePath(filePath), null),
      resizeJPG(
        filePath,
        this.generateSizePath(filePath, { width: 1080 }),
        1080,
      ),
      resizeJPG(filePath, this.generateSizePath(filePath, { width: 720 }), 720),
      resizeJPG(filePath, this.generateSizePath(filePath, { width: 480 }), 480),
      resizeJPG(filePath, this.generateSizePath(filePath, { width: 360 }), 360),
      resizeJPG(filePath, this.generateSizePath(filePath, { width: 150 }), 150),
    ]);

    unlinkSync(filePath);

    return [
      this.generateSizePath(filePath),
      this.generateSizePath(filePath, { width: 720 }),
      this.generateSizePath(filePath, { width: 480 }),
      this.generateSizePath(filePath, { width: 360 }),
      this.generateSizePath(filePath, { width: 150 }),
    ];
  }

  /**
   * compress PNG LocalStorage
   *
   * @param filePath
   * @returns
   */
  private async compressPNG(filePath: string): Promise<any[]> {
    await Promise.all([
      resizePNG(filePath, this.generateSizePath(filePath), null),
      resizePNG(
        filePath,
        this.generateSizePath(filePath, { width: 1080 }),
        1080,
      ),
      resizePNG(filePath, this.generateSizePath(filePath, { width: 720 }), 720),
      resizePNG(filePath, this.generateSizePath(filePath, { width: 480 }), 480),
      resizePNG(filePath, this.generateSizePath(filePath, { width: 360 }), 360),
      resizePNG(filePath, this.generateSizePath(filePath, { width: 150 }), 150),
    ]);

    unlinkSync(filePath);

    return [
      this.generateSizePath(filePath),
      this.generateSizePath(filePath, { width: 1080 }),
      this.generateSizePath(filePath, { width: 720 }),
      this.generateSizePath(filePath, { width: 480 }),
      this.generateSizePath(filePath, { width: 360 }),
      this.generateSizePath(filePath, { width: 150 }),
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
    const fileName = `${this.getFileName(filePath)}`;

    const keyName = Object.keys(options)
      .map((key) => {
        return `${key[0]}_${options[key]}`;
      })
      .join(',');

    return join(this.uploadDir, 'images', `${keyName}_${fileName}`);
  }

  /**
   * Movie file from temp to uploadFiles
   *
   * @param filePath
   * @returns
   */
  async moveFileToDiskStorage(filePath: string) {
    const newPath = filePath.replace('/uploads/tmp/', '/uploads/files/');

    // move file
    renameSync(filePath, newPath);

    return newPath;
  }

  /**
   * Movie file from temp to uploadFiles
   *
   * @param filePath
   * @returns
   */
  async moveVideoToDiskStorage(filePath: string) {
    const newPath = filePath.replace('/uploads/tmp/', '/uploads/videos/');

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
}
