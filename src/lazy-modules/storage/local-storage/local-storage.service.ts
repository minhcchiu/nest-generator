import { statSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LocalStorageHelper } from './local-storage.helper';
import { AppConfig } from '~config/enviroment';
import { UploadTypeEnum } from '~common/c6-upload/enum/upload-type.enum';
import { StorageDirEnum } from '~common/c6-upload/enum/storage-dir.enum';

@Injectable()
export class LocalStorageService {
  private _appUrl: string;
  private uploadOptions = {
    [UploadTypeEnum.IMAGE]: this._uploadImage,
    [UploadTypeEnum.FILE]: this._uploadFile,
    [UploadTypeEnum.AUDIO]: this._uploadAudio,
    [UploadTypeEnum.VIDEO]: this._uploadVideo,
  };

  constructor(
    private readonly localDiskHelper: LocalStorageHelper,
    private configService: ConfigService,
  ) {
    this._appUrl = this.configService.get<AppConfig>('app').appUrl;
  }

  /**
   * Upload
   *
   * @param filePath
   * @returns
   */
  async upload(filePath: string, type: UploadTypeEnum) {
    return this.uploadOptions[type](
      this.localDiskHelper,
      filePath,
      this._appUrl,
    );
  }

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  private async _uploadFile(
    localDisk: LocalStorageHelper,
    filePath: string,
    appUrl: string,
  ) {
    const uploadDir = StorageDirEnum.FILES;
    const size = statSync(filePath).size || 0;
    const folder = StorageDirEnum.FILES;

    const filemime = await localDisk.getTypeFileTypemime(filePath);
    const file = await localDisk.moveFileToDiskStorage(filePath, uploadDir);

    const type = filemime || `application/${localDisk.getFileName(filePath)}`;

    const files = [appUrl + file.slice(file.indexOf('/uploads'))];

    return { type, files, size, folder };
  }

  /**
   * Upload file/images
   *
   * @param filePath
   * @returns
   */
  private async _uploadImage(
    localDisk: LocalStorageHelper,
    filePath: string,
    appUrl: string,
  ) {
    const uploadDir = StorageDirEnum.IMAGES;
    const size = statSync(filePath).size || 0;

    const filemime = await localDisk.getTypeFileTypemime(filePath);

    const imageType = filemime.split('/')[1];

    // upload file to temp
    const files = await localDisk.compressImage(filePath, imageType);

    // replace path
    for (let i = 0; i < files.length; i += 1) {
      files[i] = appUrl + files[i].slice(files[i].indexOf('/uploads'));
    }

    const type = filemime || `image/${localDisk.getFileName(filePath)}`;

    return { type, files, size, folder: uploadDir };
  }

  /**
   * Upload video
   *
   * @param filePath
   * @returns
   */
  private async _uploadVideo(
    localDisk: LocalStorageHelper,
    filePath: string,
    appUrl: string,
  ) {
    const uploadDir = StorageDirEnum.VIDEOS;
    const size = statSync(filePath).size || 0;

    const filemime = await localDisk.getTypeFileTypemime(filePath);
    const file = await localDisk.moveFileToDiskStorage(filePath, uploadDir);

    const type = filemime || `video/${localDisk.getFileName(filePath)}`;

    const files = [appUrl + file.slice(file.indexOf('/uploads'))];

    return { type, files, size, folder: uploadDir };
  }

  /**
   * Upload audio
   *
   * @param filePath
   * @returns
   */
  private async _uploadAudio(
    localDisk: LocalStorageHelper,
    filePath: string,
    appUrl: string,
  ) {
    const uploadDir = StorageDirEnum.AUDIOS;
    const size = statSync(filePath).size || 0;

    const filemime = await localDisk.getTypeFileTypemime(filePath);

    const file = await localDisk.moveFileToDiskStorage(filePath, uploadDir);

    const type = filemime || `audio/${localDisk.getFileName(filePath)}`;

    const files = [appUrl + file.slice(file.indexOf('/uploads'))];

    return { type, files, size, folder: uploadDir };
  }
}
