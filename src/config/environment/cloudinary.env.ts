import { registerAs } from '@nestjs/config';

import { defaultEnv } from './default.env';

const cloudinaryEnv = {
  provide: 'Cloudinary',
  config: {
    cloud_name: process.env.CLOUD_NAME || defaultEnv.cloudinary.cloud_name,
    api_key: process.env.CLOUD_API_KEY || defaultEnv.cloudinary.api_key,
    api_secret:
      process.env.CLOUD_API_SECRET || defaultEnv.cloudinary.api_secret,
  },
  options: {
    folder: 'Awesome-NestJS-generator-2023',
  }, // UploadApiOptions from 'cloudinary'
};

export type CloudinaryConfig = typeof cloudinaryEnv;

export const cloudinaryConfig = registerAs('cloudinary', () => cloudinaryEnv);
