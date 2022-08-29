import { BadRequestException } from '@nestjs/common';

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
  if (!file.originalname.match(new RegExp(expression))) {
    return callback(
      new BadRequestException('Format files are allowed!'),
      false,
    );
  }

  callback(null, true);
};
