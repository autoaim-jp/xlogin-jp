FROM node:20-slim

WORKDIR /app

COPY ./storageApi/package.json /app/

RUN yarn install

COPY ./storageApi /app

