FROM node:latest

WORKDIR /app

COPY ./staticWeb/package.json /app/

RUN yarn install

COPY ./staticWeb /app

