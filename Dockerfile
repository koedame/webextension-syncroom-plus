FROM node:18.9.1-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache alpine-sdk python3
