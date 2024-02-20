# Stage 1: Build 
FROM node:21.5.0 as builder

WORKDIR /home/app

COPY package*.json ./

RUN yarn install --force && yarn cache clean --force

COPY . .

RUN yarn build

# Stage 2: Production
FROM node:21.5.0 as production

ARG NODE_ENV=PRODUCTION
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/app

COPY package*.json ./

RUN yarn install --omit=dev --force && yarn cache clean --force

COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/.env .

# COPY nginx.conf /etc/nginx/conf.d/default.conf
