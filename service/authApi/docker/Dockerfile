FROM node:20-slim

WORKDIR /app

COPY ./service/authApi/package.json /app/

RUN yarn install

COPY ./service/authApi /app

