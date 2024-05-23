#!/bin/bash

APP_DIR=/home/ubuntu/as-develop

PM2_CONFIG_FILE=$APP_DIR/.ecosystem/ecosystem.dev.config.js

cd $APP_DIR

pnpm install

pm2 start $PM2_CONFIG_FILE --env development

echo "The application was started successfully."
