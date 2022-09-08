import { registerAs } from '@nestjs/config';

const cloudinaryEnv = {
  provide: 'Cloudinary',
  config: {
    cloud_name: process.env.CLOUD_NAME || 'dvnmolznq',
    api_key: process.env.CLOUD_API_KEY || '974881534354895',
    api_secret: process.env.CLOUD_API_SECRET || 'PfIbFwRWDOiNlDd_E_XENdKyNsA',
  },
  options: {
    folder: 'Awesome-NestJS-generator-2023',
  }, // UploadApiOptions from 'cloudinary'
};

export type CloudinaryConfig = typeof cloudinaryEnv;

export const cloudinaryCofig = registerAs('cloudinary', () => cloudinaryEnv);
