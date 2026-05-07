FROM node:20-alpine as build

WORKDIR /app

COPY package*.json /

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine as production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json /app/

RUN npm ci --only=production

ENV NODE_ENV = production

CMD ["node","dist/index.js"]