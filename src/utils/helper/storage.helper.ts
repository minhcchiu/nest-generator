import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

const fileSize =
  Math.pow(1024, +process.env.UPLOAD_MAX_SIZE) ?? Math.pow(1024, 2);
const destination = './public/uploads/tmp';

/**
 * Edit file name
 * @param req
 * @param file
 * @param cb
 */
export const editFileName = (req: any, file: any, cb: any) => {
  const randomNamePre = Array(24)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  cb(null, `${Date.now()}-${randomNamePre}-${file.originalname}`);
};

// Image file filter
export const imageFileFilter = (
  extAllowed: string,
  req: any,
  file: any,
  callback: any,
) => {
  const expression = `.(${extAllowed})$`;

  // check allow file
  if (file.originalname.match(new RegExp(expression))) {
    return callback(null, true);
  }

  return callback(new BadRequestException('Format files are allowed!'), false);
};

/**
 * Storage for upload file multer
 */
export const tempStorage = {
  storage: diskStorage({ destination, filename: editFileName }),
  limits: { fileSize },
  fileFilter: (req: any, file: any, callback: any) => {
    // imageFileFilter(req, file, callback);
  },
};
