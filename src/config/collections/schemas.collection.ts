type CollectionConfig = {
  [key: string]: {
    path: string;
    name: string;
    ref: string;
  };
};

export const dbCollections: CollectionConfig = {
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
  freeApi: {
    path: 'free-apis',
    name: 'freeapis',
    ref: 'FreeApi',
  },

  authUserAccess: {
    path: 'auth-user-accesses',
    name: 'authuseraccesses',
    ref: 'AuthUserAccess',
  },

  authUserId: {
    path: 'auth-user-ids',
    name: 'authuserids',
    ref: 'AuthUserId',
  },

  roleManager: {
    path: 'role-manager',
    name: 'rolemanager',
    ref: 'Rolemanager',
  },

  collectionManager: {
    path: 'collection-manager',
    name: 'collectionmanager',
    ref: 'Collectionmanager',
  },

  endpointAPI: {
    path: 'endpoint-apis',
    name: 'endpointapis',
    ref: 'Endpointapi',
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
