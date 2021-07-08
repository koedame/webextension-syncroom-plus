FROM node:16.4.2-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache alpine-sdk python3
RUN npm install --global @vue/cli @vue/cli-init
