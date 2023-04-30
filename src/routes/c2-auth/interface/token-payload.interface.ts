import { Types } from 'mongoose';
import { Role } from 'src/routes/users/enums/role.enum';

export interface TokenPayload {
  readonly _id: Types.ObjectId;
  readonly role: Role;
}
