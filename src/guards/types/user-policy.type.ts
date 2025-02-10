import { ObjectId } from "mongodb";
export type UserPolicyType = {
  roleIds: ObjectId[];
  blockedRoleIds?: ObjectId[];
  isPublic?: boolean;
  isAuthenticated?: boolean;
};
