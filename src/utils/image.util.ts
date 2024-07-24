import sizeOf from "image-size";
import * as sharp from "sharp";
import { getFileExtension, removeFileExtension } from "./file.util";

export enum ImageSize {
  XLarge = "XLarge",
  Large = "Large",
  Medium = "Medium",
  Small = "Small",
  XSmall = "XSmall",
}

export const ImageSizeOptions: { width: number; name: ImageSize }[] = [
  { width: 150, name: ImageSize.XSmall },
  { width: 360, name: ImageSize.Small },
  { width: 480, name: ImageSize.Medium },
  { width: 720, name: ImageSize.Large },
  { width: 1080, name: ImageSize.XLarge },
];

export const getResizeOptions = (buffer: Buffer, imageSizes: ImageSize[]) => {
  const imageDimensions = sizeOf(buffer);
  const sizeOptions = ImageSizeOptions.filter(option => imageSizes.includes(option.name));

  const resizeOptions: sharp.ResizeOptions[] = [];
  const resizeNames: ImageSize[] = [];

  for (const option of sizeOptions) {
    resizeNames.push(option.name);

    if (imageDimensions.width > option.width) {
      resizeOptions.push({ width: option.width });
    }
  }

  return { resizeOptions, resizeNames };
};

export const genResizeImageName = (
  fileName: string,
  options: { width?: number; height?: number } = {},
) => {
  const keyName = Object.keys(options)
    .map(key => `${key[0]}_${options[key]}`)
    .join(",");

  const fileNameWithoutExtension = removeFileExtension(fileName);
  const fileExt = getFileExtension(fileName);

  return `${fileNameWithoutExtension}_${keyName}.${fileExt}`;
};

export const resizePNG = async (
  fileBuffer: Buffer,
  resizeOption: sharp.ResizeOptions,
  quality = 80,
) => {
  return sharp(fileBuffer).resize(resizeOption).png({ quality }).toBuffer();
};

export const resizeJPG = async (
  fileBuffer: Buffer,
  resizeOption: sharp.ResizeOptions,
  quality = 80,
) => {
  return sharp(fileBuffer).resize(resizeOption).jpeg({ quality }).toBuffer();
};

export const resizeGIF = async (fileBuffer: Buffer, resizeOption: sharp.ResizeOptions) => {
  return sharp(fileBuffer).resize(resizeOption).gif().toBuffer();
};

export const resizeFile = async (fileBuffer: Buffer, resizeOption: sharp.ResizeOptions) => {
  return sharp(fileBuffer).resize(resizeOption).toBuffer();
};

export const compressPNG = async (
  fileBuffer: Buffer,
  resizeOptions: sharp.ResizeOptions[] = [],
) => {
  return Promise.all(resizeOptions.map(resizeOption => resizePNG(fileBuffer, resizeOption)));
};

export const compressJPG = async (
  fileBuffer: Buffer,
  resizeOptions: sharp.ResizeOptions[] = [],
) => {
  return Promise.all(resizeOptions.map(resizeOption => resizeJPG(fileBuffer, resizeOption)));
};

export const compressGIF = async (
  fileBuffer: Buffer,
  resizeOptions: sharp.ResizeOptions[] = [],
) => {
  return Promise.all(resizeOptions.map(resizeOption => resizeGIF(fileBuffer, resizeOption)));
};

export const compressImage = (
  imageType: string,
  fileBuffer: Buffer,
  resizeOptions: sharp.ResizeOptions[] = [],
) => {
  if (imageType === "png") return compressPNG(fileBuffer, resizeOptions);

  if (imageType === "jpg" || imageType === "jpeg") return compressJPG(fileBuffer, resizeOptions);

  if (imageType === "gif") return compressGIF(fileBuffer, resizeOptions);

  return Promise.all(resizeOptions.map(size => resizeFile(fileBuffer, size)));
};
