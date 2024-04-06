# Stage 1: Build 
FROM node:21.5.0 as builder

WORKDIR /home/app

COPY package*.json ./

RUN npm install --force && npm cache clean --force

COPY . .

RUN npm build

# Stage 2: Production
FROM node:21.5.0 as production

ARG SERVER_ENV=PRODUCTION
ENV SERVER_ENV=${SERVER_ENV}

WORKDIR /home/app

COPY package*.json ./

RUN npm install --omit=dev --force && npm cache clean --force

COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/.env .

# COPY nginx.conf /etc/nginx/conf.d/default.conf
