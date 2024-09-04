import { Types } from "mongoose";

export type UserPolicyType = {
  userIds: Types.ObjectId[];
  userGroupIds: Types.ObjectId[];
  blockedUserGroupIds?: Types.ObjectId[];
  isPublic?: boolean;
  isAuthenticated?: boolean;
};
