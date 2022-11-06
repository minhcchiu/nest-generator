import * as fs from 'fs';

export const fileHelper = {
  /**
   * Check filepath exist
   * @param filePath
   * @returns
   */
  isFileExist(filePath: string): boolean {
    return fs.existsSync(filePath);
  },

  /**
   * Read file sync
   * @param filePath
   * @returns
   */
  readFileSync(filePath: string): any {
    return fs.readFileSync(filePath);
  },

  /**
   * Get fileName from filePath
   *
   * @param filePath
   * @returns
   */
  getFileName(filePath: string) {
    const lastIndexOfSlash = filePath.lastIndexOf('-');
    const dateTimeLength = 13;

    const fileName = filePath.slice(lastIndexOfSlash - dateTimeLength);

    return fileName;
  },
};
