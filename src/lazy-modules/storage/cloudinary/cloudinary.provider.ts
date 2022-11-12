import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CloudinaryConfig } from '~config/environment';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (config: ConfigService) => {
    const cloudinaryConfig = config.get<CloudinaryConfig>('cloudinary').config;

    return v2.config(cloudinaryConfig);
  },
  inject: [ConfigService],
};
