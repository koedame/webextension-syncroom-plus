FROM node:16.6.0-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache alpine-sdk python3
RUN npm install --global @vue/cli @vue/cli-init
