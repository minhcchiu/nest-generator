import { Types } from 'mongoose';
import { RoleEnum } from '~common/c1-user/enums/role.enum';

export interface TokenPayload {
  _id: Types.ObjectId;
  role: RoleEnum;
}
