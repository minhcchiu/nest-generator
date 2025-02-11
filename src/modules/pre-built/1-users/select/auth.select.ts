import { TokenPayload } from "~modules/pre-built/5-tokens/interface";
import { UserDocument } from "../schemas/user.schema";

export const authSelect = {
  _id: 1,
  roleIds: 1,
  accountType: 1,
  fullName: 1,
  username: 1,
  email: 1,
  phone: 1,
  socialID: 1,
};

export const formatTokenPayload = (user: UserDocument): TokenPayload => {
  return {
    _id: user._id,
    roleIds: user.roleIds,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    socialID: user.socialID,
    accountType: user.accountType,
  };
};
