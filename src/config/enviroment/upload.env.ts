import { registerAs } from '@nestjs/config';
import { defaultEnv } from './default.env';

export const uploadEnv = {
  maxSize: +process.env.UPLOAD_MAX_SIZE || defaultEnv.upload.maxSize,
  maxFiles: +process.env.UPLOAD_MAX_FILE || defaultEnv.upload.maxFile,
  maxVideoSize:
    +process.env.UPLOAD_MAX_VIDEO_SIZE || defaultEnv.upload.maxVideoSize,
  maxVideosFile:
    +process.env.UPLOAD_MAX_VIDEO_FILE || defaultEnv.upload.maxVideoFile,
  maxAudioSize:
    +process.env.UPLOAD_MAX_AUDIO_SIZE || defaultEnv.upload.maxAudioSize,
  maxAudioFile:
    +process.env.UPLOAD_MAX_AUDIO_FILE || defaultEnv.upload.maxAudioFile,

  extImages: process.env.UPLOAD_EXT_IMAGE || defaultEnv.upload.extImages,
  extRaw: process.env.UPLOAD_EXT_RAW || defaultEnv.upload.extRawFile,
  extFiles: process.env.UPLOAD_EXT_FILES || defaultEnv.upload.extFiles,
  extVideo: process.env.UPLOAD_EXT_VIDEO || defaultEnv.upload.extVideo,
  extAudio: process.env.UPLOAD_EXT_AUDIO || defaultEnv.upload.extAudio,
};

export type UploadConfig = typeof uploadEnv;
export const uploadConfig = registerAs('upload', () => uploadEnv);
