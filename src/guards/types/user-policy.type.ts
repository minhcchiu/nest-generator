import { ObjectId } from "mongodb";
export type UserPolicyType = {
  userIds: ObjectId[];
  roleIds: ObjectId[];
  blockedUserGroupIds?: ObjectId[];
  isPublic?: boolean;
  isAuthenticated?: boolean;
};
