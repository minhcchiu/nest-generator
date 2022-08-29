import { Injectable } from '@nestjs/common';

import { statSync } from 'fs';
import { LocalDiskHelper } from './local-disk.helper';
@Injectable()
export class LocalDiskService {
  constructor(private readonly localDiskHelper: LocalDiskHelper) {}

  /**
   * Upload
   * @param filePath
   * @returns
   */
  async upload(filePath: string) {
    // get fileSize and fileMine
    const fileSize = statSync(filePath).size || 0;
    const fileMime = await this.localDiskHelper.getTypeFileNeedResize(filePath);

    const isFileImage = fileMime && fileMime.split('/')[0] === 'image';

    let files = [];
    let folder: 'uploads/images' | 'uploads/files';

    // check valid file mine
    if (isFileImage) {
      const imageType = fileMime.split('/')[1];
      folder = 'uploads/images';
      files = await this.localDiskHelper.compressImage(filePath, imageType);
    } else {
      folder = 'uploads/files';
      files = [await this.localDiskHelper.moveFileToDiskStorage(filePath)];
    }

    const appURL = 'http://localhost:8888';
    // replace path
    for (let i = 0; i < files.length; i += 1) {
      files[i] = appURL + files[i].slice(files[i].indexOf('/uploads'));
    }

    return { type: fileMime, files, size: fileSize, folder };
  }
}
