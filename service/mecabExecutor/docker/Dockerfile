FROM node:20-slim

RUN apt-get update -yqq

RUN apt-get install -y --no-install-recommends mecab libmecab-dev mecab-ipadic-utf8 git curl ca-certificates build-essential file sudo
RUN apt clean
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
RUN git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git

WORKDIR /tmp/mecab-ipadic-neologd
RUN ./bin/install-mecab-ipadic-neologd -n -y
RUN echo dicdir = `mecab-config --dicdir`"/mecab-ipadic-neologd" > /etc/mecabrc
RUN sudo cp /etc/mecabrc /usr/local/etc

WORKDIR /tmp
RUN rm -rf ./mecab-ipadic-neologd

WORKDIR /app

COPY ./service/mecabExecutor/src/package.json /app/

RUN yarn install

COPY ./service/mecabExecutor/src /app

