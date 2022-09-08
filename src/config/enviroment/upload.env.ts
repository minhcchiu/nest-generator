import { registerAs } from '@nestjs/config';
import { defaultEnv } from './default.env';

export const uploadEnv = {
  uploadFileName:
    process.env.UPLOAD_FILE_NAME ?? defaultEnv.upload.uploadFileName,
  uploadFilesName:
    process.env.UPLOAD_FILE_NAME ?? defaultEnv.upload.uploadFilesName,
  maxSize: +process.env.UPLOAD_MAX_SIZE ?? 2,
  maxFile: +process.env.UPLOAD_MAX_FILE ?? defaultEnv.upload.maxFile,
  extImages: process.env.UPLOAD_EXT_IMAGE ?? defaultEnv.upload.extImages,
  extRaw: process.env.UPLOAD_EXT_RAW ?? defaultEnv.upload.extRawFile,
  extFiles: process.env.UPLOAD_EXT_FILES ?? defaultEnv.upload.extFiles,
  extVideo: process.env.UPLOAD_EXT_VIDEO ?? defaultEnv.upload.extVideo,
};

export type UploadConfig = typeof uploadEnv;
export const uploadConfig = registerAs('upload', () => uploadEnv);
