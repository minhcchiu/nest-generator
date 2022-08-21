interface CollectionName {
  [key: string]: {
    path: string;
    schemaName: string;
    ref: string;
  };
}

export const collectionNames: CollectionName = {
  // manager
  user: {
    path: 'users',
    schemaName: 'users',
    ref: 'user',
  },

  province: {
    path: 'provinces',
    schemaName: 'provinces',
    ref: 'province',
  },

  district: {
    path: 'districts',
    schemaName: 'districts',
    ref: 'district',
  },

  ward: {
    path: 'wards',
    schemaName: 'wards',
    ref: 'ward',
  },

  address: {
    path: 'address',
    schemaName: 'address',
    ref: 'address',
  },

  otp: {
    path: 'otps',
    schemaName: 'otps',
    ref: 'otp',
  },

  fileManager: {
    path: 'file-manager',
    schemaName: 'filemanager',
    ref: 'filemanager',
  },

  conversation: {
    path: 'conversations',
    schemaName: 'conversations',
    ref: 'conversation',
  },

  message: {
    path: 'messages',
    schemaName: 'messages',
    ref: 'message',
  },

  notification: {
    path: 'notifications',
    schemaName: 'notifications',
    ref: 'notification',
  },

  transaction: {
    path: 'transactions',
    schemaName: 'transactions',
    ref: 'transaction',
  },

  accountBank: {
    path: 'account-banks',
    schemaName: 'accountbanks',
    ref: 'accountbank',
  },

  // manager authorizations
  auth: {
    path: 'auth',
    schemaName: 'auth',
    ref: 'auth',
  },
  freeApi: {
    path: 'free-apis',
    schemaName: 'freeapis',
    ref: 'freeapi',
  },

  authUserAccess: {
    path: 'auth-user-accesses',
    schemaName: 'authuseraccesses',
    ref: 'authuseraccess',
  },

  authUserId: {
    path: 'auth-user-ids',
    schemaName: 'authuserids',
    ref: 'authuserid',
  },

  roleManager: {
    path: 'role-manager',
    schemaName: 'rolemanager',
    ref: 'rolemanager',
  },

  collectionManager: {
    path: 'collection-manager',
    schemaName: 'collectionmanager',
    ref: 'collectionmanager',
  },

  endpointAPI: {
    path: 'endpoint-apis',
    schemaName: 'endpointapis',
    ref: 'endpointapi',
  },

  historyAccessApi: {
    path: 'history-access-apis',
    schemaName: 'historyaccessapis',
    ref: 'historyaccessapi',
  },

  // features
  post: {
    path: 'posts',
    schemaName: 'posts',
    ref: 'post',
  },

  comment: {
    path: 'comments',
    schemaName: 'comments',
    ref: 'comment',
  },
};
