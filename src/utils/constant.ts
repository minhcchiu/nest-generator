import { CreateUserDto } from "~modules/pre-built/1-users/dto/create-user.dto";
import { AccountStatus } from "~modules/pre-built/1-users/enums/account-status.enum";
import { AccountTypeEnum } from "~modules/pre-built/1-users/enums/account-type.enum";
import { HttpMethod } from "~modules/pre-built/3-policies/enum/http-method";

export const ROLES_DEFAULT = {
  User: "USER",
  SupperAdmin: "SUPER_ADMIN",
};

export const SUPPER_ADMIN_ACCOUNT: CreateUserDto = {
  username: "supperadmin",
  password: "supperadmin",
  email: "supperadmin@local.com",
  fullName: "Supper Admin",
  accountType: AccountTypeEnum.Local,
  bio: `Supper Admin`,
  status: AccountStatus.Verified,
};

export const HttpMethodActions = {
  [HttpMethod.Get]: "Read",
  [HttpMethod.Post]: "Create",
  [HttpMethod.Put]: "Update",
  [HttpMethod.Patch]: "Update",
  [HttpMethod.Delete]: "Delete",
};

export const ReputationValue = {
  createQuestion: 10,
  answerQuestion: 10,
  upvoteQuestion: 5,
  upvoteAnswer: 5,
  viewQuestion: 1,
  actionVote: 1,
};

export const BADGE_CRITERIA_QUESTIONS = {
  totalViews: {
    bronze: 1,
    silver: 2,
    gold: 5,
  },
  totalUpvoteCount: {
    bronze: 1,
    silver: 2,
    gold: 100,
  },
  totalAnswerCount: {
    silver: 2,
    gold: 5,
  },
  totalQuestions: {
    bronze: 1,
    silver: 2,
    gold: 5,
  },
};

export const BADGE_CRITERIA_ANSWERS = {
  totalAnswers: {
    bronze: 1,
    silver: 2,
    gold: 5,
  },
  totalUpvoteCount: {
    silver: 2,
    gold: 5,
  },
  totalRepliesCount: {
    silver: 2,
    gold: 5,
  },
};

export const BADGE_CRITERIA_READ_QUESTIONS = {
  totalViews: {
    bronze: 1,
    silver: 2,
    gold: 5,
  },
};
