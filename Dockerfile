FROM node:16.17.0

EXPOSE 8888

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]
