import * as fs from 'fs';

export const FileHelper = {
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
};
