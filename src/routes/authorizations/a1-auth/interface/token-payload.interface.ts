import { Types } from 'mongoose';
import { RoleEnum } from '~common/c1-users/enums/role.enum';

export interface TokenPayload {
  _id: Types.ObjectId;
  role: RoleEnum;
}
