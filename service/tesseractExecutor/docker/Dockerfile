FROM ubuntu:22.04

RUN apt-get update && apt-get install -y software-properties-common && add-apt-repository -y ppa:alex-p/tesseract-ocr-devel
RUN apt-get update && apt-get install -y tesseract-ocr-all 

RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt install -y nodejs
RUN npm install -g yarn

RUN mkdir /home/work

WORKDIR /app

COPY ./service/tesseractExecutor/src/package.json /app/

RUN yarn install

COPY ./service/tesseractExecutor/src /app

