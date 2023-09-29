FROM node:20-slim

WORKDIR /app

COPY ./staticWeb/package.json /app/

RUN yarn install

COPY ./staticWeb /app

