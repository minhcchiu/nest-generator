import * as sharp from "sharp";

/**
 * resize iamge PNG
 * @param filePath
 * @param filePathNew
 * @param size
 * @returns
 */
const resizePNG = async (
	filePath: string,
	filePathNew: string,
	size: number | null,
) => {
	const quality = 80;

	const semiTransparentRedPng = await sharp(filePath)
		.resize(size)
		.png({ quality })
		.toFile(`${filePathNew}`);

	return semiTransparentRedPng;
};

/**
 * Resize image JPG
 * @param filePath
 * @param filePathNew
 * @param size
 * @returns
 */
const resizeJPG = async (
	filePath: string,
	filePathNew: string,
	size: number | null,
) => {
	const quality = 80;

	const semiTransparentRedJpg = await sharp(filePath)
		.resize(size)
		.jpeg({ quality })
		.toFile(`${filePathNew}`);

	return semiTransparentRedJpg;
};

/**
 * resize iamge PNG
 * @param filePath
 * @param filePathNew
 * @param size
 * @returns
 */
const resizeGIF = async (
	filePath: string,
	filePathNew: string,
	size: number | null,
) => {
	const semiTransparentRedPng = await sharp(filePath)
		.resize(size)
		.gif()
		.toFile(`${filePathNew}`);

	return semiTransparentRedPng;
};

export { resizePNG, resizeJPG, resizeGIF };
