export const getFileExtension = (originalname: string): string => {
	return originalname.split(".").pop()?.toLowerCase() || "";
};

export const removeFileExtension = (originalname: string): string => {
	return originalname.split(".").slice(0, -1).join(".");
};

export const genUniqueFilename = (originalname: string) => {
	const lastIndexOfSlash = originalname.lastIndexOf(".");
	const oName = originalname.slice(0, lastIndexOfSlash);

	const randomNamePre = Array(24)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join("");

	const fileName = `${Date.now()}-${randomNamePre}-${oName}`
		.replace(/[^\w\s]/gi, "")
		.replace(/\s+/g, "-")
		.toLowerCase();
	const fileExt = getFileExtension(originalname);

	return `${fileName}.${fileExt}`;
};

export const getFileName = (filePath: string) => {
	return filePath.split("/").pop();
};
