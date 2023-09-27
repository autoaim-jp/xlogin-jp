FROM node:latest

WORKDIR /app

COPY ./authApi/package.json /app/

RUN yarn install

COPY ./authApi /app

