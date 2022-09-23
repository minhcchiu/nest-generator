import { statSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LocalStorageHelper } from './local-storage.helper';
import { AppConfig } from '~config/enviroment';
import { UploadTypeEnum } from '~common/c6-upload/enum/upload-type.enum';

@Injectable()
export class LocalStorageService {
  private folderStoreFile:
    | '/uploads/images/'
    | '/uploads/files/'
    | '/uploads/videos/'
    | '/uploads/audios/';

  private appUrl: string;

  constructor(
    private readonly localDiskHelper: LocalStorageHelper,
    private configService: ConfigService,
  ) {
    this.appUrl = this.configService.get<AppConfig>('app').appUrl;
  }

  /**
   * Upload
   *
   * @param filePath
   * @returns
   */
  async upload(filePath: string, type: UploadTypeEnum) {
    if (type === UploadTypeEnum.FILE) return this._uploadFile(filePath);

    if (type === UploadTypeEnum.VIDEO) return this._uploadVideo(filePath);

    return this._uploadFile(filePath);
  }

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  private async _uploadFile(filePath: string) {
    // get fileSize and fileMine
    const fileSize = statSync(filePath).size || 0;
    const fileMime = await this.localDiskHelper.getTypeFileNeedResize(filePath);

    const isFileImage = fileMime && fileMime.split('/')[0] === 'image';

    let files = [];

    // upload image
    if (isFileImage) {
      const imageType = fileMime.split('/')[1];

      this.folderStoreFile = '/uploads/images/';

      files = await this.localDiskHelper.compressImage(filePath, imageType);
    } else {
      // upload file
      this.folderStoreFile = '/uploads/files/';

      files = [
        await this.localDiskHelper.moveFileToDiskStorage(
          filePath,
          this.folderStoreFile,
        ),
      ];
    }

    // replace path
    for (let i = 0; i < files.length; i += 1) {
      files[i] = this.appUrl + files[i].slice(files[i].indexOf('/uploads'));
    }

    return {
      type: fileMime || 'application/unknown',
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
  private async _uploadVideo(filePath: string) {
    // get fileSize and fileMine
    const fileSize = statSync(filePath).size || 0;

    this.folderStoreFile = '/uploads/videos/';

    const fileMime = await this.localDiskHelper.getTypeFileNeedResize(filePath);

    const file = await this.localDiskHelper.moveFileToDiskStorage(
      filePath,
      this.folderStoreFile,
    );

    return {
      type: fileMime || 'video/unknown',
      files: [this.appUrl + file.slice(file.indexOf('/uploads'))],
      size: fileSize,
      folder: this.folderStoreFile,
    };
  }

  /**
   * Upload audio
   *
   * @param filePath
   * @returns
   */
  private async _uploadAudio(filePath: string) {
    // get fileSize and fileMine
    const fileSize = statSync(filePath).size || 0;

    this.folderStoreFile = '/uploads/audios/';

    const fileMime = await this.localDiskHelper.getTypeFileNeedResize(filePath);

    const file = await this.localDiskHelper.moveFileToDiskStorage(
      filePath,
      this.folderStoreFile,
    );

    return {
      type: fileMime || 'audio/unknown',
      files: [this.appUrl + file.slice(file.indexOf('/uploads'))],
      size: fileSize,
      folder: this.folderStoreFile,
    };
  }
}
