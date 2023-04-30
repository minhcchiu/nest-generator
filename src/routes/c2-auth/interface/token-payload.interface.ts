import { Types } from 'mongoose';
import { RoleEnum } from 'src/routes/users/enums/role.enum';

export interface TokenPayload {
  readonly _id: Types.ObjectId;
  readonly role: RoleEnum;
}
