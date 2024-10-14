import { BadRequestException, Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { StorageServerEnum } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/static.env";
import { EventEmitterService } from "~shared/event-emitters/event-emitter.service";
import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { LocalService } from "~shared/storage/local-storage/local.service";
import { S3Service } from "~shared/storage/s3/s3.service";
import { genUniqueFilename, getFileExtension } from "~utils/file.util";
import { ImageSize } from "~utils/image.util";
import { ResourceTypeEnum } from "./enum/resource-type.enum";
import { FileFormatted } from "./types/file-formatted.type";
import { FileOption } from "./types/file-option.type";
import { FileFailed } from "./types/upload.error.type";
import { FileUploaded } from "./types/upload.result.type";

@Injectable()
export class UploadService {
  private fileFilter: Record<ResourceTypeEnum, FileOption> | object = {};
  private storageFolders: Record<ResourceTypeEnum, string> | object = {};
  private storageServer: StorageServerEnum;

  constructor(
    private readonly localService: LocalService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly s3Service: S3Service,
    private readonly eventEmitterService: EventEmitterService,
  ) {
    // init storage
    this.init();
  }

  init() {
    this.storageServer = EnvStatic.getAppConfig().storageServer;
    const uploadConfig = EnvStatic.getUploadConfig();

    this.storageFolders = uploadConfig.storageFolders;
    this.fileFilter = {
      image: uploadConfig.image,
      video: uploadConfig.video,
      raw: uploadConfig.raw,
      audio: uploadConfig.audio,
      auto: uploadConfig.auto,
    };
  }

  async uploadFiles(fileInputs: Express.Multer.File[], userId: ObjectId, imageSizes?: ImageSize[]) {
    const promiseSettled = await Promise.allSettled(
      fileInputs.map(fileInput => this._saveFile(fileInput, imageSizes)),
    );

    const filesFailed: FileFailed[] = [];
    const filesUploaded: FileUploaded[] = [];

    for (const uploaded of promiseSettled) {
      if (uploaded.status === "fulfilled") {
        filesUploaded.push(uploaded.value);
      } else {
        filesFailed.push({
          originalname: uploaded.reason.response?.originalname,
          fileSize: uploaded.reason.response?.fileSize,
          error: uploaded.reason.response?.error,
        });
      }
    }

    this.eventEmitterService.emitFileUploaded(filesUploaded, userId);

    return {
      filesUploaded,
      filesFailed,
    };
  }

  async uploadFile(fileInput: Express.Multer.File, userId: ObjectId, imageSizes?: ImageSize[]) {
    const fileSaved = await this._saveFile(fileInput, imageSizes);

    this.eventEmitterService.emitFileUploaded([fileSaved], userId);

    return fileSaved;
  }

  async _saveFile(fileInput: Express.Multer.File, imageSizes?: ImageSize[]): Promise<FileUploaded> {
    try {
      // validate file
      const fileFormatted = this._validateFile(fileInput);

      let uploaded: FileUploaded;
      switch (this.storageServer) {
        case StorageServerEnum.S3:
          uploaded = await this.s3Service.saveFile(fileFormatted, imageSizes);
          break;

        case StorageServerEnum.Cloudinary:
          uploaded = await this.cloudinaryService.saveFile(fileFormatted, imageSizes);
          break;

        case StorageServerEnum.Local:
          uploaded = await this.localService.saveFile(fileFormatted, imageSizes);
          break;

        default:
          throw new BadRequestException("Storage server not found");
      }

      return uploaded;
    } catch (error) {
      throw new BadRequestException({
        error: error?.message || "Something went wrong",
        originalname: fileInput.originalname,
        fileSize: fileInput.size,
      });
    }
  }

  private _validateFile(file: Express.Multer.File): FileFormatted {
    const fileExt = getFileExtension(file.originalname);
    const resourceType = this._getResourceType(fileExt);

    const { maxSize, allowedExtensions } = this.fileFilter[resourceType];
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > maxSize || !allowedExtensions.includes(fileExt)) {
      throw new BadRequestException(
        `Invalid file. Maximum size: ${maxSize / (1024 * 1024)}MB, allowed extensions: ${allowedExtensions.join(", ")}`,
      );
    }

    const fileFolder = this.storageFolders[resourceType];
    const fileName = genUniqueFilename(file.originalname);

    return {
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
      resourceType,
      fileFolder,
      fileExt,
      fileName,
      originalname: file.originalname,
    };
  }

  private _getResourceType(fileExt: string): ResourceTypeEnum {
    const fileType = Object.keys(this.fileFilter).find(key => {
      return this.fileFilter[key].allowedExtensions.includes(fileExt);
    });

    if (!fileType) throw new BadRequestException("Unsupported file type");

    return <ResourceTypeEnum>fileType;
  }
}
