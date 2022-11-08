import { registerAs } from '@nestjs/config';

import { defaultEnv } from './default.env';

export const uploadEnv = {
  imageMaxSize: +process.env.UPLOAD_IMAGE_MAX_SIZE || defaultEnv.upload.imageMaxSize,
  rawMaxSize: +process.env.UPLOAD_RAW_MAX_SIZE || defaultEnv.upload.rawMaxSize,
  videoMaxSize: +process.env.UPLOAD_VIDEO_MAX_SIZE || defaultEnv.upload.videoMaxSize,
  audioMaxSize: +process.env.UPLOAD_AUDIO_MAX_SIZE || defaultEnv.upload.audioMaxSize,

  imageMaxFiles: +process.env.UPLOAD_IMAGE_MAX_FILE || defaultEnv.upload.imageMaxFiles,
  rawMaxFiles: +process.env.UPLOAD_RAW_MAX_FILE || defaultEnv.upload.rawMaxFiles,
  videoMaxFiles: +process.env.UPLOAD_VIDEO_MAX_FILE || defaultEnv.upload.videoMaxFiles,
  audioMaxFiles: +process.env.UPLOAD_AUDIO_MAX_FILE || defaultEnv.upload.audioMaxFiles,

  imagesExt: process.env.UPLOAD_IMAGE_EXT || defaultEnv.upload.imagesExt,
  rawExt: process.env.UPLOAD_RAW_EXT || defaultEnv.upload.rawExt,
  videoExt: process.env.UPLOAD_VIDEO_EXT || defaultEnv.upload.videoExt,
  audioExt: process.env.UPLOAD_AUDIO_EXT || defaultEnv.upload.audioExt,
};

export type UploadConfig = typeof uploadEnv;
export const uploadConfig = registerAs('upload', () => uploadEnv);
