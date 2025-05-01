export const schemaTypesMap = {
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
  Date: "Date",
  ObjectId: "SchemaTypes.ObjectId",
  Mixed: "SchemaTypes.Mixed",
  Array: "[SchemaTypes.Mixed]",
};

export const dataTypesMap = {
  String: "string",
  Number: "number",
  Boolean: "boolean",
  Date: "Date",
  ObjectId: "ObjectId",
  Mixed: "any",
};

export const validatorMap = {
  String: "@IsString()",
  Number: "@IsNumber()",
  Boolean: "@IsBoolean()",
  Date: "@IsDate()",
  ObjectId: "@IsObjectId()",
  Mixed: "@IsOptional()",
  Array: "@IsArray()",
  Object: "@IsObject()",
};

export const preBuiltMap = {
  User: {
    schema: "~modules/pre-built/1-users/schemas/user.schema",
    module: "~modules/pre-built/1-users/user.module",
  },
  Role: {
    schema: "~modules/pre-built/2-roles/schemas/role.schema",
    module: "~modules/pre-built/2-roles/role.module",
  },
  Policy: {
    schema: "~modules/pre-built/3-policies/schemas/policy.schema",
    module: "~modules/pre-built/3-policies/policy.module",
  },
  Resource: {
    schema: "~modules/pre-built/3-resources/schemas/resource.schema",
    module: "~modules/pre-built/3-resources/resource.module",
  },
  MenuGroup: {
    schema: "~modules/pre-built/4-menu-groups/schemas/menu-group.schema",
    module: "~modules/pre-built/4-menu-groups/menu-group.module",
  },
  Menu: {
    schema: "~modules/pre-built/4-menus/schemas/menu.schema",
    module: "~modules/pre-built/4-menus/menu.module",
  },
  SystemMenu: {
    schema: "~modules/pre-built/4-system-menus/schemas/system-menu.schema",
    module: "~modules/pre-built/4-system-menus/system-menu.module",
  },
  Token: {
    schema: "~modules/pre-built/5-tokens/schemas/token.schema",
    module: "~modules/pre-built/5-tokens/token.module",
  },
  Otp: {
    schema: "~modules/pre-built/6-otp/schemas/otp.schema",
    module: "~modules/pre-built/6-otp/otp.module",
  },
  UserFile: {
    schema: "~modules/pre-built/7-user-files/schemas/user-file.schema",
    module: "~modules/pre-built/7-user-files/user-file.module",
  },
  Province: {
    schema: "~modules/pre-built/8-provinces/schemas/province.schema",
    module: "~modules/pre-built/8-provinces/province.module",
  },
  District: {
    schema: "~modules/pre-built/9-districts/schemas/district.schema",
    module: "~modules/pre-built/9-districts/district.module",
  },
  Ward: {
    schema: "~modules/pre-built/10-wards/schemas/ward.schema",
    module: "~modules/pre-built/10-wards/ward.module",
  },
  Setting: {
    schema: "~modules/pre-built/11-settings/schemas/setting.schema",
    module: "~modules/pre-built/11-settings/setting.module",
  },
  Notification: {
    schema: "~modules/pre-built/12-notifications/schemas/notification.schema",
    module: "~modules/pre-built/12-notifications/notification.module",
  },
};
