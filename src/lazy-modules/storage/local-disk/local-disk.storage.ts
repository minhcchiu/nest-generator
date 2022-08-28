import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '~helper/storage.helper';

const UPLOAD_MAX_SIZE = Math.pow(1024, 25);
const UPLOAD_FILE_EXT =
  'jpg|jpeg|png|gif|txt|pdf|doc|docx|xls|xlsx|ppt|pptx|csv|json';

const fileSize = UPLOAD_MAX_SIZE ?? Math.pow(1024, 2);
const extAllowed = UPLOAD_FILE_EXT;
const destination = './public/uploads/tmp';

/**
 * Storage for upload file multer
 */
export const localDiskStorage = {
  storage: diskStorage({ destination, filename: editFileName }),

  limits: { fileSize },

  fileFilter: (req: any, file: any, callback: any) => {
    imageFileFilter(extAllowed, req, file, callback);
  },
};
