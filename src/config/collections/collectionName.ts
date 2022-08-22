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
    ref: 'User',
  },

  province: {
    path: 'provinces',
    schemaName: 'provinces',
    ref: 'Province',
  },

  district: {
    path: 'districts',
    schemaName: 'districts',
    ref: 'District',
  },

  ward: {
    path: 'wards',
    schemaName: 'wards',
    ref: 'Ward',
  },

  address: {
    path: 'address',
    schemaName: 'address',
    ref: 'Address',
  },

  otp: {
    path: 'otps',
    schemaName: 'otps',
    ref: 'Otp',
  },

  fileManager: {
    path: 'file-manager',
    schemaName: 'filemanager',
    ref: 'FileManager',
  },

  conversation: {
    path: 'conversations',
    schemaName: 'conversations',
    ref: 'Conversation',
  },

  message: {
    path: 'messages',
    schemaName: 'messages',
    ref: 'Message',
  },

  notification: {
    path: 'notifications',
    schemaName: 'notifications',
    ref: 'Notification',
  },

  transaction: {
    path: 'transactions',
    schemaName: 'transactions',
    ref: 'Transaction',
  },

  accountBank: {
    path: 'account-banks',
    schemaName: 'accountbanks',
    ref: 'AccountBank',
  },

  // manager authorizations
  auth: {
    path: 'auth',
    schemaName: 'auth',
    ref: 'Auth',
  },
  freeApi: {
    path: 'free-apis',
    schemaName: 'freeapis',
    ref: 'FreeApi',
  },

  authUserAccess: {
    path: 'auth-user-accesses',
    schemaName: 'authuseraccesses',
    ref: 'AuthUserAccess',
  },

  authUserId: {
    path: 'auth-user-ids',
    schemaName: 'authuserids',
    ref: 'AuthUserId',
  },

  roleManager: {
    path: 'role-manager',
    schemaName: 'rolemanager',
    ref: 'Rolemanager',
  },

  collectionManager: {
    path: 'collection-manager',
    schemaName: 'collectionmanager',
    ref: 'Collectionmanager',
  },

  endpointAPI: {
    path: 'endpoint-apis',
    schemaName: 'endpointapis',
    ref: 'Endpointapi',
  },

  historyAccessApi: {
    path: 'history-access-apis',
    schemaName: 'historyaccessapis',
    ref: 'Historyaccessapi',
  },

  // features
  post: {
    path: 'posts',
    schemaName: 'posts',
    ref: 'Post',
  },

  comment: {
    path: 'comments',
    schemaName: 'comments',
    ref: 'Comment',
  },
};
