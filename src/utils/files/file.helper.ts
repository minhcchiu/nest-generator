import { ResizeOptions } from "sharp";
import { resizeFile, resizeGIF, resizeJPG, resizePNG } from "./resize-image";

export const compressPNG = async (
	fileBuffer: Buffer,
	resizeOptions: ResizeOptions[] = [],
) => {
	return Promise.all(
		resizeOptions.map((resizeOption) => resizePNG(fileBuffer, resizeOption)),
	);
};

export const compressJPG = async (
	fileBuffer: Buffer,
	resizeOptions: ResizeOptions[] = [],
) => {
	return Promise.all(
		resizeOptions.map((resizeOption) => resizeJPG(fileBuffer, resizeOption)),
	);
};

export const compressGIF = async (
	fileBuffer: Buffer,
	resizeOptions: ResizeOptions[] = [],
) => {
	return Promise.all(
		resizeOptions.map((resizeOption) => resizeGIF(fileBuffer, resizeOption)),
	);
};

export const compressImage = (
	imageType: string,
	fileBuffer: Buffer,
	resizeOptions: ResizeOptions[] = [],
) => {
	if (imageType === "png") return compressPNG(fileBuffer, resizeOptions);

	if (imageType === "jpg" || imageType === "jpeg")
		return compressJPG(fileBuffer, resizeOptions);

	if (imageType === "gif") return compressGIF(fileBuffer, resizeOptions);

	return Promise.all(resizeOptions.map((size) => resizeFile(fileBuffer, size)));
};
