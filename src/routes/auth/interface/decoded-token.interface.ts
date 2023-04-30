import { Types } from 'mongoose';
import { Role } from 'src/routes/users/enums/role.enum';

export interface DecodedToken {
  readonly _id: Types.ObjectId;
  readonly role: Role;

  iat: number;
  exp: number;
}
