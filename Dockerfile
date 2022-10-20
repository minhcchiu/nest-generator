FROM node:16.17.0

EXPOSE 3000

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json ./

RUN npm install

COPY . .


CMD [ "npm", "run", "start" ]
