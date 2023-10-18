FROM node:20-slim

WORKDIR /app

COPY ./service/authApi/src/package.json /app/

RUN yarn install

COPY ./service/authApi/src /app

