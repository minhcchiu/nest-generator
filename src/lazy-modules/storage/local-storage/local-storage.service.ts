import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { statSync } from 'fs';
import { LocalStorageHelper } from './local-storage.helper';

@Injectable()
export class LocalStorageService {
  constructor(
    private readonly localDiskHelper: LocalStorageHelper,
    private configService: ConfigService,
  ) {}

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
    let uploadDir: 'uploads/images' | 'uploads/files';

    // upload image
    if (isFileImage) {
      const imageType = fileMime.split('/')[1];
      uploadDir = 'uploads/images';
      files = await this.localDiskHelper.compressImage(filePath, imageType);
    } else {
      // upload file
      uploadDir = 'uploads/files';
      files = [await this.localDiskHelper.moveFileToDiskStorage(filePath)];
    }

    const appURL = this.configService.get<string>('clientURL');
    // replace path
    for (let i = 0; i < files.length; i += 1) {
      files[i] = appURL + files[i].slice(files[i].indexOf('/uploads'));
    }

    return { type: fileMime, files, size: fileSize, folder: uploadDir };
  }
}
