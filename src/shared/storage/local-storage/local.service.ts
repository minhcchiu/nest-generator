import { Injectable } from "@nestjs/common";
import { rmSync, writeFileSync } from "fs";
import { ResizeOptions } from "sharp";
import { EnvStatic } from "src/configurations/env.static";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { FileUploaded } from "~modules/pre-built/7-uploads/types/upload.result.type";
import {
  compressImage,
  genResizeImageName,
  getResizeOptions,
  type ImageSize,
} from "~utils/image.util";

@Injectable()
export class LocalService {
  private serverUrl: string;

  constructor() {
    this.serverUrl = EnvStatic.getAppConfig().serverUrl;
  }

  async saveFile(file: FileFormatted, imageSizes: ImageSize[] = []): Promise<FileUploaded> {
    // path storage
    const fileOriginal = `${file.fileFolder}/${file.fileName}`;

    writeFileSync(`public/${fileOriginal}`, file.buffer);

    const url = `${this.serverUrl}/static/${fileOriginal}`;

    const resourceKeys = [fileOriginal];

    // Handle image resize
    const resizeUrls: Record<string, string> = {};
    if (file.resourceType === ResourceTypeEnum.Image && imageSizes.length) {
      const { resizeOptions, resizeNames } = getResizeOptions(file.buffer, imageSizes);

      const imagesResized = await this._resizeImages(file, resizeOptions);

      resizeNames.forEach((name, index) => {
        resizeUrls[`url${name}`] = imagesResized[index]?.url || url;

        // Add key to resource
        if (imagesResized[index]?.key) resourceKeys.push(imagesResized[index].key);
      });
    }

    return {
      ...resizeUrls,
      url,
      resourceKeys,
      fileFolder: file.fileFolder,
      fileName: file.fileName,
      fileSize: file.size,
      fileType: file.mimetype,
      originalname: file.originalname,
      storageLocation: StorageLocationEnum.Local,
      resourceType: file.resourceType,
    };
  }

  async deleteByKey(resourceKey: string) {
    const localFilePath = `${process.cwd()}/public/${resourceKey}`;

    rmSync(localFilePath);
  }

  async deleteManyByKeys(resourceKeys: string[]) {
    await Promise.all(resourceKeys.map(item => this.deleteByKey(item)));
  }

  private async _resizeImages(
    file: FileFormatted,
    resizeOptions: ResizeOptions[] = [], // 150, 360, 480, 720
  ) {
    const imagesCompressed = await compressImage(file.fileExt, file.buffer, resizeOptions);

    const imagesResized: { url: string; key: string }[] = [];

    resizeOptions.forEach((resizeOption, index) => {
      const imageName = genResizeImageName(file.fileName, resizeOption);
      const filePath = `${file.fileFolder}/${imageName}`;

      writeFileSync(`public/${filePath}`, imagesCompressed[index]);

      imagesResized.push({
        url: `${this.serverUrl}/static/${filePath}`,
        key: filePath,
      });
    });

    return imagesResized;
  }
}
