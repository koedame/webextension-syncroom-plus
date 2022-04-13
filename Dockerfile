FROM node:17.9.0-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache alpine-sdk python3
RUN npm install --global @vue/cli @vue/cli-init
