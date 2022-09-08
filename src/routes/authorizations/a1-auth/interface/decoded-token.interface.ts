import { Types } from 'mongoose';
import { RoleEnum } from '~common/c1-users/enums/role.enum';

export interface DecodedToken {
  readonly _id: Types.ObjectId;
  readonly role: RoleEnum;

  iat: number;
  exp: number;
}
