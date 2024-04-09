import { getFileExtension, getFileName } from "./file.util";
import { resizeGIF, resizeJPG, resizePNG } from "./resize-image";

const genImageResizePath = (
	filePath: string,
	options: { width?: number; height?: number } = {},
) => {
	const fileName = getFileName(filePath);
	const saveDir = filePath.split("/").slice(0, -1).join("/");

	const keyName = Object.keys(options)
		.map((key) => {
			return `${key[0]}_${options[key]}`;
		})
		.join(",");

	return `${saveDir}/${keyName}_${fileName}`;
};

const compressJPG = async (filePath: string) => {
	const fileXs = genImageResizePath(filePath, { width: 150 });
	const fileSm = genImageResizePath(filePath, { width: 360 });
	const fileMd = genImageResizePath(filePath, { width: 480 });
	const fileLg = genImageResizePath(filePath, { width: 720 });

	await Promise.all([
		resizeJPG(filePath, fileXs, 150),
		resizeJPG(filePath, fileSm, 360),
		resizeJPG(filePath, fileMd, 480),
		resizeJPG(filePath, fileLg, 720),
	]);

	return {
		fileXs,
		fileSm,
		fileMd,
		fileLg,
	};
};

const compressGIF = async (filePath: string) => {
	const fileXs = genImageResizePath(filePath, { width: 150 });
	const fileSm = genImageResizePath(filePath, { width: 360 });
	const fileMd = genImageResizePath(filePath, { width: 480 });
	const fileLg = genImageResizePath(filePath, { width: 720 });

	await Promise.all([
		resizeGIF(filePath, fileXs, 150),
		resizeGIF(filePath, fileSm, 360),
		resizeGIF(filePath, fileMd, 480),
		resizeGIF(filePath, fileLg, 720),
	]);

	return {
		fileXs,
		fileSm,
		fileMd,
		fileLg,
	};
};

/**
 * compress PNG LocalStorage
 *
 * @param fileName
 * @returns
 */
const compressPNG = async (filePath: string) => {
	const fileXs = genImageResizePath(filePath, { width: 150 });
	const fileSm = genImageResizePath(filePath, { width: 360 });
	const fileMd = genImageResizePath(filePath, { width: 480 });
	const fileLg = genImageResizePath(filePath, { width: 720 });

	await Promise.all([
		resizePNG(filePath, fileXs, 150),
		resizePNG(filePath, fileSm, 360),
		resizePNG(filePath, fileMd, 480),
		resizePNG(filePath, fileLg, 720),
	]);

	return {
		fileXs,
		fileSm,
		fileMd,
		fileLg,
	};
};

export const compressImage = (filePath: string) => {
	const imageType = getFileExtension(filePath);

	if (imageType === "jpg" || imageType === "jpeg") return compressJPG(filePath);

	// image type = png
	if (imageType === "png") return compressPNG(filePath);

	if (imageType === "gif") return compressGIF(filePath);

	return {
		fileXs: filePath,
		fileSm: filePath,
		fileMd: filePath,
		fileLg: filePath,
	};
};
