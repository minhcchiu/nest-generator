import { UploadConfig } from '~interface/upload.interface';

export const uploadConfigEnviroment: UploadConfig = {
  maxSize: Math.pow(1024, +process.env.UPLOAD_MAX_SIZE || 2),
  filSize: +process.env.FILE_SIZE,
  extImages: process.env.UPLOAD_IMAGE_FILE,
  extFiles: process.env.UPLOAD_RAW_FILE,
  extFile: process.env.UPLOAD_FILE,
  extVideo: process.env.UPLOAD_VIDEO,
};
