import * as sharp from "sharp";

const resizePNG = async (
	fileBuffer: Buffer,
	resizeOption: sharp.ResizeOptions,
	quality = 80,
) => {
	return sharp(fileBuffer).resize(resizeOption).png({ quality }).toBuffer();
};

const resizeJPG = async (
	fileBuffer: Buffer,
	resizeOption: sharp.ResizeOptions,
	quality = 80,
) => {
	return sharp(fileBuffer).resize(resizeOption).jpeg({ quality }).toBuffer();
};

const resizeGIF = async (
	fileBuffer: Buffer,
	resizeOption: sharp.ResizeOptions,
) => {
	return sharp(fileBuffer).resize(resizeOption).gif().toBuffer();
};

const resizeFile = async (
	fileBuffer: Buffer,
	resizeOption: sharp.ResizeOptions,
) => {
	return sharp(fileBuffer).resize(resizeOption).toBuffer();
};

export { resizeFile, resizeGIF, resizeJPG, resizePNG };
