import { ObjectId } from "mongodb";
export type UserPolicyType = {
  userIds: ObjectId[];
  userGroupIds: ObjectId[];
  blockedUserGroupIds?: ObjectId[];
  isPublic?: boolean;
  isAuthenticated?: boolean;
};
