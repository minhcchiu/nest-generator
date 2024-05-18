# Builder stage
FROM node:20.12.2 as builder

WORKDIR /home/app

COPY package*.json ./

COPY tsconfig.json .

COPY . .

# Install dependencies and build the application
RUN npm install --force && npm run build

# Production stage
FROM node:20.12.2 as production

ARG NODE_ENV=PRODUCTION

ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/app

COPY package*.json ./

COPY tsconfig.json .

# Install only production dependencies
RUN npm cache clean --force
RUN npm install --only=production --force

COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/.env .
COPY --from=builder /home/app/public ./public

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install Nest.js CLI in the production stage
RUN npm install -g @nestjs/cli

# Start your application
CMD ["npm", "start"]
