import * as crypto from "crypto";

export const getFileExtension = (originalname: string): string => {
  return originalname.split(".").pop()?.toLowerCase() || "";
};

export const removeFileExtension = (originalname: string): string => {
  return originalname.split(".").slice(0, -1).join(".");
};

export const genUniqueFilename = (originalname: string) => {
  const lastIndexOfSlash = originalname.lastIndexOf(".");
  const oName = originalname.slice(0, lastIndexOfSlash);

  const randomNamePre = crypto.randomBytes(24).toString("hex");

  const fileName = `${randomNamePre}-${oName
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  const fileExt = getFileExtension(originalname);

  return `${fileName}.${fileExt}`;
};
