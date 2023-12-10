FROM node:20-slim

WORKDIR /app

COPY ./service/chatgptExecutor/src/package.json /app/

RUN yarn install

COPY ./service/chatgptExecutor/src /app

