import { statSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LocalStorageHelper } from './local-storage.helper';

@Injectable()
export class LocalStorageService {
  private folderStoreFile:
    | 'uploads/images'
    | 'uploads/files'
    | 'uploads/videos';

  constructor(
    private readonly localDiskHelper: LocalStorageHelper,
    private configService: ConfigService,
  ) {}

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  async upload(filePath: string) {
    // get fileSize and fileMine
    const fileSize = statSync(filePath).size || 0;
    const fileMime = await this.localDiskHelper.getTypeFileNeedResize(filePath);

    const isFileImage = fileMime && fileMime.split('/')[0] === 'image';

    let files = [];

    // upload image
    if (isFileImage) {
      const imageType = fileMime.split('/')[1];

      this.folderStoreFile = 'uploads/images';

      files = await this.localDiskHelper.compressImage(filePath, imageType);
    } else {
      // upload file
      this.folderStoreFile = 'uploads/files';

      files = [await this.localDiskHelper.moveFileToDiskStorage(filePath)];
    }

    const appURL = this.configService.get<string>('clientURL');

    // replace path
    for (let i = 0; i < files.length; i += 1) {
      files[i] = appURL + files[i].slice(files[i].indexOf('/uploads'));
    }

    return {
      type: fileMime,
      files,
      size: fileSize,
      folder: this.folderStoreFile,
    };
  }

  /**
   * Upload video
   *
   * @param filePath
   * @returns
   */
  async uploadVideo(filePath: string) {
    // get fileSize and fileMine
    const fileSize = statSync(filePath).size || 0;
    this.folderStoreFile = 'uploads/videos';

    const file = await this.localDiskHelper.moveVideoToDiskStorage(filePath);

    const appURL = this.configService.get<string>('clientURL');
    console.log({ appURL });
    return {
      file: appURL + file.slice(file.indexOf('/uploads')),
      size: fileSize,
      folder: this.folderStoreFile,
    };
  }
}
