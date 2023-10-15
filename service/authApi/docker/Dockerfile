FROM node:20-slim

WORKDIR /app

COPY ./authApi/package.json /app/

RUN yarn install

COPY ./authApi /app

