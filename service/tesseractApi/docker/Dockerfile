FROM node:20-slim

WORKDIR /app

COPY ./service/tesseractApi/src/package.json /app/

RUN yarn install

COPY ./service/tesseractApi/src /app

