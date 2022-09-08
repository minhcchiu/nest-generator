import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CloudinaryEnv } from '~interface/cloudinary-env.interface';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (config: ConfigService) => {
    const cloudinaryConfig = config.get<CloudinaryEnv>('cloudinary').config;

    return v2.config(cloudinaryConfig);
  },
  inject: [ConfigService],
};
