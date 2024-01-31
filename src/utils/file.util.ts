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
export const generateFileName = (originalname: string) => {
	const lastIndexOfSlash = originalname.lastIndexOf(".");
	const oName = originalname.slice(0, lastIndexOfSlash);

	const randomNamePre = Array(24)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join("");

	const fileName = `${Date.now()}-${randomNamePre}-${oName}`;

	return fileName
		.replace(/[^\w\s]/gi, "")
		.replace(/\s+/g, "-")
		.toLowerCase();
};
