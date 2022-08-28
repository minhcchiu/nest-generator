import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import { unlinkSync } from 'fs';
import { CloudinaryConfig } from '~interface/cloudinary.interface';

@Injectable()
export class CloudinaryService {
  private readonly cloudinaryConfig: CloudinaryConfig;

  constructor(private readonly configService: ConfigService) {
    this.cloudinaryConfig = configService.get<CloudinaryConfig>('cloudinary');
  }

  /**
   * Upload
   * @param filePath
   * @param options
   * @returns
   */
  async upload(
    filePath: string,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      options = {
        ...this.cloudinaryConfig.options,
        options,
      };

      v2.uploader.upload(filePath, options, (err, result) => {
        if (err) return reject(new BadRequestException('File does not exist.'));

        // remove file in temp
        unlinkSync(filePath);

        resolve(result);
      });
    });
  }

  /**
   * Resize image
   * @param id
   * @param height
   * @param width
   * @returns
   */
  resizeImage(id: string, height: number, width: number) {
    return v2.url(id, { height, width, crop: 'scale', format: 'jpg' });
  }

  /**
   * Delete resources
   * @param resourceIds
   * @returns
   */
  deleteResources(resourceIds: string[]) {
    return v2.api.delete_resources(resourceIds);
  }

  /**
   * Destroy
   * @param resourceId
   * @returns
   */
  async destroy(resourceId: string) {
    try {
      return await v2.uploader.destroy(resourceId);
    } catch (error) {
      console.log({ error });
    }
  }
}
