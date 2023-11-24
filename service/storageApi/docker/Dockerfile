FROM node:20-slim

WORKDIR /app

COPY ./service/storageApi/src/package.json /app/

RUN yarn install

COPY ./service/storageApi/src /app

