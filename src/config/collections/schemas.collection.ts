type CollectionConfig = {
  [key: string]: {
    path: string;
    name: string;
    ref: string;
  };
};
// block list, access
export const dbCollections: CollectionConfig = {
  // Authorizations
  menu: {
    path: 'menus',
    name: 'menus',
    ref: 'Menu',
  },
  userRoleMenu: {
    path: 'userRoleMenus',
    name: 'userRoleMenus',
    ref: 'UserRoleMenu',
  },
  endpoint: {
    path: 'endpoints',
    name: 'endpoints',
    ref: 'Endpoint',
  },

  // Common
  user: {
    path: 'users',
    name: 'users',
    ref: 'User',
  },

  province: {
    path: 'provinces',
    name: 'provinces',
    ref: 'Province',
  },

  district: {
    path: 'districts',
    name: 'districts',
    ref: 'District',
  },

  ward: {
    path: 'wards',
    name: 'wards',
    ref: 'Ward',
  },

  address: {
    path: 'address',
    name: 'address',
    ref: 'Address',
  },

  otp: {
    path: 'otps',
    name: 'otps',
    ref: 'Otp',
  },

  fileManager: {
    path: 'file-manager',
    name: 'filemanager',
    ref: 'FileManager',
  },

  file: {
    path: 'files',
    name: 'files',
    ref: 'File',
  },

  upload: {
    path: 'uploads',
    name: '',
    ref: '',
  },

  conversation: {
    path: 'conversations',
    name: 'conversations',
    ref: 'Conversation',
  },

  message: {
    path: 'messages',
    name: 'messages',
    ref: 'Message',
  },

  notification: {
    path: 'notifications',
    name: 'notifications',
    ref: 'Notification',
  },

  transaction: {
    path: 'transactions',
    name: 'transactions',
    ref: 'Transaction',
  },

  accountBank: {
    path: 'account-banks',
    name: 'accountbanks',
    ref: 'AccountBank',
  },

  auth: {
    path: 'auth',
    name: 'auth',
    ref: 'Auth',
  },
  historyAccessApi: {
    path: 'history-access-apis',
    name: 'historyaccessapis',
    ref: 'Historyaccessapi',
  },

  banner: {
    path: 'banners',
    name: 'banners',
    ref: 'Banner',
  },

  post: {
    path: 'posts',
    name: 'posts',
    ref: 'Post',
  },

  comment: {
    path: 'comments',
    name: 'comments',
    ref: 'Comment',
  },
};
