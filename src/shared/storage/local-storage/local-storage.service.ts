import { ResourceTypeEnum } from '~routes/1-upload/enum/resource-type.enum';
import { StorageDirEnum } from '~routes/1-upload/enum/storage-dir.enum';

import { Injectable } from '@nestjs/common';

import { localStorageHelper } from './local-storage.helper';

@Injectable()
export class LocalStorageService {
  private uploadOptions = {
    [ResourceTypeEnum.IMAGE]: this._uploadImage,
    [ResourceTypeEnum.FILE]: this._uploadFile,
    [ResourceTypeEnum.AUDIO]: this._uploadAudio,
    [ResourceTypeEnum.VIDEO]: this._uploadVideo,
  };

  /**
   * Upload
   *
   * @param filePath
   * @returns
   */
  async upload(filePath: string, type: ResourceTypeEnum) {
    return this.uploadOptions[type](filePath);
  }

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  private async _uploadFile(filePath: string) {
    const uploadDir = StorageDirEnum.FILES;

    return localStorageHelper.upload(filePath, uploadDir, ResourceTypeEnum.FILE);
  }

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  private async _uploadImage(filePath: string) {
    const uploadDir = StorageDirEnum.IMAGES;

    return localStorageHelper.uploadImage(filePath, uploadDir);
  }

  /**
   * Upload video
   *
   * @param filePath
   * @returns
   */
  private async _uploadVideo(filePath: string) {
    const uploadDir = StorageDirEnum.VIDEOS;

    return localStorageHelper.upload(filePath, uploadDir, ResourceTypeEnum.VIDEO);
  }

  /**
   * Upload audio
   *
   * @param filePath
   * @returns
   */
  private async _uploadAudio(filePath: string) {
    const uploadDir = StorageDirEnum.AUDIOS;

    return localStorageHelper.upload(filePath, uploadDir, ResourceTypeEnum.AUDIO);
  }
}
