FROM node:20-slim

WORKDIR /app

COPY ./service/textLibApi/src/package.json /app/

RUN yarn install

COPY ./service/textLibApi/src /app

