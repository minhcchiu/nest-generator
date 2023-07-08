import * as fs from "fs";

export const existsSync = (filePath: string): boolean => {
	return fs.existsSync(filePath);
};

export const readFileSync = (filePath: string): any => {
	return fs.readFileSync(filePath);
};

export const getFileName = (filePath: string) => {
	const lastIndexOfSlash = filePath.lastIndexOf("-");
	const dateTimeLength = 13;

	const fileName = filePath.slice(lastIndexOfSlash - dateTimeLength);

	return fileName;
};
