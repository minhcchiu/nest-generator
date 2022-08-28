import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import { unlinkSync } from 'fs';

@Injectable()
export class CloudinaryService {
  /**
   * Upload
   * @param filePath
   * @param options
   * @returns
   */
  async upload(
    filePath: string,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(filePath, options, (err, result) => {
        if (err) return reject(err);
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
  reSizeImage(id: string, height: number, width: number) {
    return v2.url(id, { height, width, crop: 'scale', format: 'jpg' });
  }

  /**
   * Delete delete resources
   * @param images
   * @returns
   */
  deleteResources(images: string[]) {
    return v2.api.delete_resources(images);
  }

  /**
   * Destroy
   * @param public_id
   * @returns
   */
  async destroy(public_id: string) {
    try {
      return await v2.uploader.destroy(public_id);
    } catch (error) {
      console.log({ error });
    }
  }
}
