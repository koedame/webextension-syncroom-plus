FROM node:15.4.0-alpine

RUN mkdir /app
WORKDIR /app

RUN npm install --global @vue/cli @vue/cli-init
