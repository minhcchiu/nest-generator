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
        ...options,
      };

      v2.uploader.upload(filePath, options, (err, result) => {
        if (err) return reject(new BadRequestException(err.message));

        // remove file in temp
        unlinkSync(filePath);

        resolve(result);
      });
    });
  }

  /**
   * Resize image
   * @param id
   * @param width
   * @returns
   */
  private resizeImage(id: string, width: number) {
    return v2.url(id, {
      width,
      opacity: 80,
      // crop: 'scale',
      format: 'jpeg',
    });
  }

  /**
   * Get all resize image
   * @param url
   * @param public_id
   * @returns
   */
  async getAllResizeImage(url: string, public_id: string) {
    return [
      url,
      this.resizeImage(public_id, 1080),
      this.resizeImage(public_id, 720),
      this.resizeImage(public_id, 360),
      this.resizeImage(public_id, 480),
      this.resizeImage(public_id, 360),
      this.resizeImage(public_id, 150),
    ];
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
