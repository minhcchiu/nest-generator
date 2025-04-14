import { AuthModule } from "~modules/pre-built/1-auth/auth.module";
import { UserModule } from "~modules/pre-built/1-users/user.module";
import { WardModule } from "~modules/pre-built/10-wards/ward.module";
import { SettingModule } from "~modules/pre-built/11-settings/setting.module";
import { NotificationModule } from "~modules/pre-built/12-notifications/notification.module";
import { GeneratorModule } from "~modules/pre-built/14-generators/generator.module";
import { PolicyModule } from "~modules/pre-built/3-policies/policy.module";
import { MenuGroupModule } from "~modules/pre-built/4-menu-groups/menu-group.module";
import { MenuModule } from "~modules/pre-built/4-menus/menu.module";
import { SystemMenuModule } from "~modules/pre-built/4-system-menus/system-menu.module";
import { TokenModule } from "~modules/pre-built/5-tokens/token.module";
import { OtpModule } from "~modules/pre-built/6-otp/otp.module";
import { UploadModule } from "~modules/pre-built/7-uploads/upload.module";
import { UserFileModule } from "~modules/pre-built/7-user-files/user-file.module";
import { ProvinceModule } from "~modules/pre-built/8-provinces/province.module";
import { DistrictModule } from "~modules/pre-built/9-districts/district.module";

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
  GeneratorModule,
];
