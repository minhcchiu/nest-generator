export const cloudinaryConfig = {
  provide: 'Cloudinary',
  config: {
    cloud_name: process.env.CLOUD_NAME || 'dvnmolznq',
    api_key: process.env.CLOUD_API_KEY || '974881534354895',
    api_secret: process.env.CLOUD_API_SECRET || 'PfIbFwRWDOiNlDd_E_XENdKyNsA',
  },
};
