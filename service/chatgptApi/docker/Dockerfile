FROM node:20-slim

WORKDIR /app

COPY ./service/chatgptApi/src/package.json /app/

RUN yarn install

COPY ./service/chatgptApi/src /app

