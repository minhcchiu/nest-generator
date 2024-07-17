import { Types } from "mongoose";

export type UserPolicyType = {
  userIds: Types.ObjectId[];
  userGroupIds: Types.ObjectId[];
  blockedUserGroupIds?: Types.ObjectId[];
  blockedUserIds?: Types.ObjectId[];
  isPublic: boolean;
};
