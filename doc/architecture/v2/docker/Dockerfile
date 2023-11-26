FROM ubuntu:22.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    tzdata \
    language-pack-ja \
    graphviz \
    fonts-ipafont \
    && apt-get -y clean

ENV TZ Asia/Tokyo
ENV LANG ja_JP.utf8

