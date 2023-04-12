FROM node:19.9.0-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache alpine-sdk python3
