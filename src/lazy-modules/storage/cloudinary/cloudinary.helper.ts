import { v2 } from 'cloudinary';
import { StorageServiceEnum } from '~common/c5-files/enum/storage-service.enum';

export const cloudinaryHelper = {
  /**
   * Resize image
   *
   * @param id
   * @param width
   * @returns
   */
  _resizeImage(id: string, width: number) {
    return v2.url(id, {
      width,
      opacity: 80,
      crop: 'fill',
      format: 'jpg',
    });
  },

  /**
   * Generate images resize
   *
   * @param url
   * @param public_id
   * @returns
   */
  generateImagesResize(url: string, public_id: string) {
    return [
      url,
      this._resizeImage(public_id, 1080),
      this._resizeImage(public_id, 720),
      this._resizeImage(public_id, 360),
      this._resizeImage(public_id, 480),
      this._resizeImage(public_id, 360),
      this._resizeImage(public_id, 150),
    ];
  },

  /**
   * Get upload result
   *
   * @param file
   * @returns
   */
  getUploadResult(file: any) {
    const { bytes, format, resource_type, folder, public_id, created_at, secure_url, files } =
      file;

    return {
      type: `${resource_type}/${format}`,
      files: files,
      size: bytes,
      folder,
      resourceID: public_id,
      created_at,
      secureUrl: secure_url,
      storage: StorageServiceEnum.CLOUDINARY,
    };
  },
};
