# Config app environment variable
export NODE_ENV=development
export PORT=8888

# CLIENT URL
export CLIENT_URL=http://localhost:8888 

# URL of the Mongo DB
# export MONGODB_URL="mongodb://127.0.0.1:27017/node-boilerplate"
# export MONGODB_URL="mongodb+srv://miniSocialNetwork:miniSocialNetwork@cluster0.3rkpg.mongodb.net/mini-social-network?retryWrites=true&w=majority"
export DATABASE_NAME=awesome-nest-generator
export DATABASE_URI="mongodb+srv://minhchiu:Minhchiu.it.01@cluster0.llaipgz.mongodb.net"


# JWT
# JWT secret key
export JWT_SECRET=jwt_secret
export JWT_ACCESS_SECRET=access_secret
export JWT_REFRESH_SECRET=refresh_secret
export JWT_ACTIVATE_SECRET=activate_secret
export JWT_SIGNUP_SECRET=signup_secret
export JWT_RESET_PASSWORD_SECRET=reset_pass_secret

# JWT expirations
export JWT_EXPIRESIN=30m
export JWT_ACCESS_EXPIRATION=5days
export JWT_REFRESH_EXPIRATION=30days
export JWT_RESET_PASSWORD_EXPIRATION=10m
export JWT_ACTIVATE_EXPIRATION=5m
export JWT_SIGNUP_EXPIRATION=10m


# CLOUDINARY
export CLOUD_NAME=dvnmolznq
export CLOUD_API_KEY=974881534354895
export CLOUD_API_SECRET=PfIbFwRWDOiNlDd_E_XENdKyNsA


# CONFIG MAIL_SERVER: gmail|sendgrid
export MAIL_SERVER=sendgrid

# CONFIG GMAIL
export SMTP_GMAIL_HOST=smtp.gmail.com
export SMTP_GMAIL_PORT=587
export SMTP_GMAIL_USERNAME=minh.mchiu@gmail.com
export SMTP_GMAIL_PASSWORD=mphkvglrdlylboiu

# CONFIG SENDGRID 
export SMTP_SENDGRID_HOST=smtp.sendgrid.net
export SMTP_SENDGRID_PORT=587
export SMTP_SENDGRID_USERNAME=apikey
export SMTP_SENDGRID_PASSWORD=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 #SENDGRID_API_KEY

# CONFIG EMAIL FROM
export MAILER_FROM_EMAIL=minh.mchiu@gmail.com
export MAILER_NAME_NAME=minhchiu

# OAuth client
export OAUTH_CLIENT_ID=679275323194-0m8bkvm059v14kcepq57l873v8lm7r37.apps.googleusercontent.com
export OAUTH_CLIENT_SECRET=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

# UPLOAD
export UPLOAD_MAX_SIZE=25 #MB  
export UPLOAD_IMAGE_FILE='jpg|jpeg|png|gif|txt|pdf|doc|docx|xls|xlsx|ppt|pptx|csv|json'
export UPLOAD_IMAGE_FILE="jpg|jpeg|png|gif"
export UPLOAD_RAW_FILE="txt|pdf|doc|docx|xls|xlsx|ppt|pptx|csv|json"
export fileSize=2
