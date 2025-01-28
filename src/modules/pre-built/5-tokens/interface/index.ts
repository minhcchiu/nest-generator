import { ObjectId } from "mongodb";
import { AccountTypeEnum } from "~modules/pre-built/1-users/enums/account-type.enum";

export interface TokenPayload {
  readonly userId: ObjectId;
  readonly roleIds: ObjectId[];
  readonly accountType: AccountTypeEnum;
  readonly fullName: string;
  readonly username?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly socialID?: string;
  tokenId?: string;
}

export interface DecodedToken {
  readonly iat: number;
  readonly exp: number;
  readonly userId: ObjectId;
  readonly roleIds: ObjectId[];
  readonly accountType: AccountTypeEnum;
  readonly fullName: string;
  readonly username?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly socialID?: string;
  readonly tokenId?: string;
}
