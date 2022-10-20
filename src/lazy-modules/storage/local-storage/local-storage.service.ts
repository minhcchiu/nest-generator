import { ResourceTypeEnum } from '~common/c6-upload/enum/resource-type.enum';
import { StorageDirEnum } from '~common/c6-upload/enum/storage-dir.enum';
import { AppConfig } from '~config/enviroment';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { localStorageHelper } from './local-storage.helper';

@Injectable()
export class LocalStorageService {
  private _appUrl: string;
  private uploadOptions = {
    [ResourceTypeEnum.IMAGE]: this._uploadImage,
    [ResourceTypeEnum.FILE]: this._uploadFile,
    [ResourceTypeEnum.AUDIO]: this._uploadAudio,
    [ResourceTypeEnum.VIDEO]: this._uploadVideo,
  };

  constructor(private configService: ConfigService) {
    this._appUrl = this.configService.get<AppConfig>('app').appUrl;
  }

  /**
   * Upload
   *
   * @param filePath
   * @returns
   */
  async upload(filePath: string, type: ResourceTypeEnum) {
    return this.uploadOptions[type](filePath, this._appUrl);
  }

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  private async _uploadFile(filePath: string, appUrl: string) {
    const uploadDir = StorageDirEnum.FILES;

    return localStorageHelper.upload(
      filePath,
      uploadDir,
      appUrl,
      ResourceTypeEnum.FILE,
    );
  }

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  private async _uploadImage(filePath: string, appUrl: string) {
    const uploadDir = StorageDirEnum.IMAGES;

    return localStorageHelper.uploadImage(filePath, uploadDir, appUrl);
  }

  /**
   * Upload video
   *
   * @param filePath
   * @returns
   */
  private async _uploadVideo(filePath: string, appUrl: string) {
    const uploadDir = StorageDirEnum.VIDEOS;

    return localStorageHelper.upload(
      filePath,
      uploadDir,
      appUrl,
      ResourceTypeEnum.VIDEO,
    );
  }

  /**
   * Upload audio
   *
   * @param filePath
   * @returns
   */
  private async _uploadAudio(filePath: string, appUrl: string) {
    const uploadDir = StorageDirEnum.AUDIOS;

    return localStorageHelper.upload(
      filePath,
      uploadDir,
      appUrl,
      ResourceTypeEnum.AUDIO,
    );
  }
}
