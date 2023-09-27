FROM node:latest

WORKDIR /app

COPY ./storageApi/package.json /app/

RUN yarn install

COPY ./storageApi /app

