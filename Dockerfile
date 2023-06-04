FROM node:20.0.0 as builder 

WORKDIR /home/app 

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .
 
RUN npm run build 


FROM node:20.0.0 as production 

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/app 

COPY package*.json ./

RUN npm install --omit=dev  && npm cache clean --force     

COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/package.json .
COPY --from=builder /home/app/.env .

COPY nginx.conf /etc/nginx/conf.d/default.conf
