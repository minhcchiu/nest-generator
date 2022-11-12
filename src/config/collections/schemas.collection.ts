type CollectionConfig = {
  [key: string]: {
    path: string;
    name: string;
    ref: string;
  };
};

export const dbCollections: CollectionConfig = {
  // Authorizations
  apiResource: {
    path: 'api-resources',
    name: 'apiresources',
    ref: 'ApiResource',
  },
  apiCollection: {
    path: 'api-collections',
    name: 'apicollections',
    ref: 'ApiCollection',
  },
  freeApi: {
    path: 'free-apis',
    name: 'freeapis',
    ref: 'FreeApis',
  },
  authAccess: {
    path: 'auth-accesses',
    name: 'authAccesses',
    ref: 'AuthAccesses',
  },
  rightsGroup: {
    path: 'rights-group',
    name: 'rightsgroups',
    ref: 'RightsGroups',
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
