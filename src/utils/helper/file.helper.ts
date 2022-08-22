import * as fs from 'fs'

export const FileHelper = {
  isFileExist(filePath: string): boolean {
    return fs.existsSync(filePath);
  },

  readFileSync(filePath: string): any {
    return fs.readFileSync(filePath);
  }
}