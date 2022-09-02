import { Types } from 'mongoose';
import { RoleEnum } from '~common/c1-user/enums/role.enum';

export interface TokenPayload {
  readonly _id: Types.ObjectId;
  readonly role: RoleEnum;
}
