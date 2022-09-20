export const defaultEnv = {
  app: {
    env: 'development',
    port: 8888,
    clientUrl: 'http://localhost:8888',
  },

  database: {
    name: 'awesome-nest-generator',
    uri: 'mongodb+srv://minhchiu:Minhchiu.it.01@cluster0.llaipgz.mongodb.net',
  },

  cloudinary: {
    cloud_name: 'dvnmolznq',
    api_key: '974881534354895',
    api_secret: 'PfIbFwRWDOiNlDd_E_XENdKyNsA',
  },

  upload: {
    uploadFileName: 'file',
    uploadFilesName: 'files',
    maxSize: 25,
    maxFile: 2,
    extImages: 'jpg|jpeg|png|gif',
    extRawFile: 'txt|pdf|doc|docx|xls|xlsx|ppt|pptx|csv|json',
    extFiles: 'jpg|jpeg|png|gif|txt|pdf|doc|docx|xls|xlsx|ppt|pptx|csv|json',
    extVideo: 'mp4|mkv',
    maxVideoSize: 40,
    maxVideoFile: 4,
  },

  jwt: {
    secret: '?wOfl6_4Q_KeYS(#a{qGe+W2!L_q6H', // https://randomkeygen.com/
    expiresin: '30m',
    accessExpiration: '88d',
    refreshExpiration: '1m',
    signupExpiration: '10m',
    resetPasswordExpiration: '5m',
    accessSecret: 'JWT_ACCESS_SECRET',
    refreshSecret: 'JWT_REFRESH_SECRET',
    signupSecret: 'JWT_SIGNUP_SECRET',
  },

  mailer: {
    mailServer: 'gmail',

    gmailHost: 'smtp.gmail.com',
    gmailPort: 587,
    gmailUsername: 'minhcc01.vn@gmail.com',
    gmailPassword: 'alvewqcllxfpbitk',

    sendgridHost: 'smtp.sendgrid.net',
    sendgridUsername: 'apikey',
    sendgridPassword:
      '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',

    fromEmail: 'minhcc01.vn@gmail.com',
    name: 'minhchiu',
  },
};
