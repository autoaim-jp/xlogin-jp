FROM node:latest

WORKDIR /app

COPY ./src/ /app

RUN npm install

RUN version=master npm run init-xdevkit

EXPOSE 3000

