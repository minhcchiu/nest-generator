import { ObjectId } from 'mongodb';
import { Role } from 'src/routes/users/enums/role.enum';

export interface TokenPayload {
  readonly _id: ObjectId;
  readonly role: Role;
}
