import { TaskModule } from "~modules/finances/0-tasks/task.module";
import { TestModule } from "~modules/finances/0-tests/test.module";
import { AccountModule } from "~modules/finances/1-accounts/account.module";
import { CategoryModule } from "~modules/finances/2-categories/category.module";
import { SummaryModule } from "~modules/finances/3-summaries/summary.module";
import { TransactionModule } from "~modules/finances/4-transactions/transaction.module";
import { ChatgptModule } from "~modules/questions-modules/0-chatgpt/chatgpt.module";
import { GeneralModule } from "~modules/questions-modules/0-generals/general.module";
import { AnswerModule } from "~modules/questions-modules/1-answers/answer.module";
import { QuestionModule } from "~modules/questions-modules/1-questions/question.module";
import { TagModule } from "~modules/questions-modules/3-tags/tag.module";
import { InteractionModule } from "~modules/questions-modules/4-interactions/interaction.module";
import { TagFollowerModule } from "~modules/questions-modules/5-tag_followers/tag_follower.module";
import { AuthModule } from "./pre-built/1-auth/auth.module";
import { UserModule } from "./pre-built/1-users/user.module";
import { WardModule } from "./pre-built/10-wards/ward.module";
import { SettingModule } from "./pre-built/11-settings/setting.module";
import { NotificationModule } from "./pre-built/12-notifications/notification.module";
import { PolicyModule } from "./pre-built/3-policies/policy.module";
import { MenuGroupModule } from "./pre-built/4-menu-groups/menu-group.module";
import { MenuModule } from "./pre-built/4-menus/menu.module";
import { SystemMenuModule } from "./pre-built/4-system-menus/system-menu.module";
import { TokenModule } from "./pre-built/5-tokens/token.module";
import { OtpModule } from "./pre-built/6-otp/otp.module";
import { UploadModule } from "./pre-built/7-uploads/upload.module";
import { UserFileModule } from "./pre-built/7-user-files/user-file.module";
import { ProvinceModule } from "./pre-built/8-provinces/province.module";
import { DistrictModule } from "./pre-built/9-districts/district.module";

export const FeatureModules = [
  // pre-built
  AuthModule,
  UserModule,
  PolicyModule,
  MenuGroupModule,
  MenuModule,
  SystemMenuModule,
  TokenModule,
  OtpModule,
  UploadModule,
  UserFileModule,
  ProvinceModule,
  DistrictModule,
  WardModule,
  SettingModule,
  NotificationModule,

  // Finances Modules
  TestModule,
  TaskModule,
  AccountModule,
  CategoryModule,
  TransactionModule,
  SummaryModule,

  // Questions Modules
  AnswerModule,
  QuestionModule,
  TagModule,
  TagFollowerModule,
  InteractionModule,
  GeneralModule,
  ChatgptModule,
];
