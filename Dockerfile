FROM node:16.13.0-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache alpine-sdk python3
