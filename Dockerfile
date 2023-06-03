FROM node:20.0.0 as builder 

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .
 
RUN npm run build 


FROM node:20.0.0 as production 

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install --omit=dev  && npm cache clean --force     

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/.env .

CMD [ "node", "dist/main" ]
