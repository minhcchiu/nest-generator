export const defaultEnv = {
  app: {
    env: 'development',
    port: 8888,
    appUrl: 'http://localhost:8888',
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

  otp: {
    maximunSecondSendOtp: 10,
  },

  upload: {
    imageMaxSize: 10,
    rawMaxSize: 10,
    videoMaxSize: 10,
    audioMaxSize: 10,

    imageMaxFiles: 10,
    rawMaxFiles: 10,
    videoMaxFiles: 10,
    audioMaxFiles: 10,

    imagesExt: 'jpg|jpeg|png|gif',
    rawExt: 'txt|pdf|doc|docx|xls|xlsx|ppt|pptx|csv|json',
    videoExt: 'mp4|mkv',
    audioExt: 'mp3|aac|wav|flac',
    // UPLOAD_IMAGE_QUALITY_COMPRESS
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
    gmailUsername: 'himinhchiu@gmail.com',
    gmailPassword: 'lnhucyaruvqjkssp',

    sendgridHost: 'smtp.sendgrid.net',
    sendgridUsername: 'apikey',
    sendgridPassword:
      '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',

    fromEmail: 'himinhchiu@gmail.com',
    name: 'minhchiu',
  },
};
