import { ObjectId } from 'mongodb';
import { Role } from '~pre-built/1-users/enums/role.enum';

export interface TokenPayload {
  readonly _id: ObjectId;
  readonly role: Role;
}
