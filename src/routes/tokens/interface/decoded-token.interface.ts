import { ObjectId } from 'mongodb';
import { Role } from 'src/routes/users/enums/role.enum';

export interface DecodedToken {
  readonly _id: ObjectId;
  readonly role: Role;

  iat: number;
  exp: number;
}
