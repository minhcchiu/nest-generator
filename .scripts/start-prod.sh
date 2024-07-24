#!/bin/bash

APP_DIR=/home/ubuntu/asnest-prod/source

PM2_CONFIG_FILE=$APP_DIR/.ecosystem/ecosystem.prod.config.js

cd $APP_DIR

pnpm install

pm2 start $PM2_CONFIG_FILE --env production

echo "The application was started successfully."
