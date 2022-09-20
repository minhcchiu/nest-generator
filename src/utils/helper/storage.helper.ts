/* eslint-disable */
import { BadRequestException } from '@nestjs/common';
import { toSlug } from './slug.helper';

/**
 * Edit file name
 *
 * @param req
 * @param file
 * @param cb
 */
export const editFileName = (req: any, file: any, cb: any) => {
  const randomNamePre = Array(24)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  cb(null, `${Date.now()}-${randomNamePre}-${toSlug(file.originalname)}`);
};

/**
 * Image file filter
 *
 * @param extAllowed
 * @param req
 * @param file
 * @param callback
 * @returns
 */
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
