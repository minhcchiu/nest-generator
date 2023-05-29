FROM node:20.0.0

EXPOSE 8888

WORKDIR /app

RUN npm i yarn@latest -g

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]
